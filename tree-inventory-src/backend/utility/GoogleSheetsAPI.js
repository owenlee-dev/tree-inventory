const fs = require("fs").promises;
const path = require("path");
const process = require("process");
const { authenticate } = require("@google-cloud/local-auth");
const { google } = require("googleapis");

const SCOPES = ["https://www.googleapis.com/auth/spreadsheets"];
const TOKEN_PATH = path.join(__dirname, "token.json");
const CREDENTIALS_PATH = path.join(__dirname, "credentials.json");

/**
 * Reads previously authorized credentials from the save file.
 *
 * @return {Promise<OAuth2Client|null>}
 */
async function loadSavedCredentialsIfExist() {
  try {
    const content = await fs.readFile(TOKEN_PATH);
    const credentials = JSON.parse(content);
    return google.auth.fromJSON(credentials);
  } catch (err) {
    return null;
  }
}
/**
 * Serializes credentials to a file comptible with GoogleAUth.fromJSON.
 *
 * @param {OAuth2Client} client
 * @return {Promise<void>}
 */
async function saveCredentials(client) {
  const content = await fs.readFile(CREDENTIALS_PATH);
  const keys = JSON.parse(content);
  const key = keys.installed || keys.web;
  const payload = JSON.stringify({
    type: "authorized_user",
    client_id: key.client_id,
    client_secret: key.client_secret,
    refresh_token: client.credentials.refresh_token,
  });
  await fs.writeFile(TOKEN_PATH, payload);
}

/**
 * Load or request or authorization to call APIs.
 *
 */
async function authorize() {
  let client = await loadSavedCredentialsIfExist();
  if (client) {
    return client;
  }
  //error is on next line
  client = await authenticate({
    scopes: SCOPES,
    keyfilePath: CREDENTIALS_PATH,
  });

  if (client.credentials) {
    await saveCredentials(client);
  }
  return client;
}

async function dataToObjects(data) {
  // Assuming the first row of your data contains the headers
  const headers = data[0];
  const products = data.slice(1).map((row) => {
    let product = {};
    headers.forEach((header, index) => {
      product[header] = row[index];
    });
    return product;
  });

  return products;
}
// (kind of gross) Function to transform the data from google sheets which is in Array[Array] to the nested object format used in redux state object
async function organizeData(data) {
  const organizedData = {};
  let currentCategory = "";
  let currentSubcategory = "";
  let isDirectItemUnderCategory = false;

  data.forEach((item) => {
    // Check if the item is a main category (all uppercase)
    if (item.Variety === item.Variety.toUpperCase()) {
      currentCategory = item.Variety.toLowerCase();
      organizedData[currentCategory] = {};
      currentSubcategory = "";
      isDirectItemUnderCategory = true;
    } else if (currentCategory) {
      // Check if the item is a subcategory (not a detailed item)
      if (Object.values(item).some((value) => value === undefined)) {
        currentSubcategory = item.Variety.toLowerCase().trim();
        organizedData[currentCategory][currentSubcategory] = [];
        isDirectItemUnderCategory = false;
      } else if (currentSubcategory) {
        // This is an item under the current subcategory
        organizedData[currentCategory][currentSubcategory].push(item);
        isDirectItemUnderCategory = false;
      } else if (isDirectItemUnderCategory) {
        // This is a direct item under the main category without subcategories
        if (!Array.isArray(organizedData[currentCategory])) {
          organizedData[currentCategory] = [];
        }
        organizedData[currentCategory].push(item);
      }
    }
  });

  return organizedData;
}

// Function to read store data from google sheets
async function readStore(auth, pageName) {
  const sheets = google.sheets({ version: "v4", auth });
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: "1IZ6oZOa7XAHnQV0ZNSGX9aujS6ugAwc_rUjcGESuYmM",
    range: pageName,
  });
  let dataAsObjects = await dataToObjects(res.data.values);
  let organizedData = await organizeData(dataAsObjects);
  return organizedData;
}

// Multipurpose function used for fetching pickup locations, etransfers and coupons
async function readDataFromSheet(auth, pageName) {
  const sheets = google.sheets({ version: "v4", auth });
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: "1IZ6oZOa7XAHnQV0ZNSGX9aujS6ugAwc_rUjcGESuYmM",
    range: pageName,
  });
  let dataAsObjects = await dataToObjects(res.data.values);
  return dataAsObjects;
}

// This function removes pending etransfers from google sheets when confirmed on front end
async function confirmOrders(auth, pageName, ordersToRemove) {
  const sheets = google.sheets({ version: "v4", auth });
  const spreadsheetId = "1IZ6oZOa7XAHnQV0ZNSGX9aujS6ugAwc_rUjcGESuYmM";

  try {
    //retrieve spreadsheet meta data
    const spreadsheet = await sheets.spreadsheets.get({
      spreadsheetId,
      includeGridData: false,
    });

    // Find the sheetId of the given pageName
    const sheet = spreadsheet.data.sheets.find(
      (s) => s.properties.title === pageName
    );
    if (!sheet) {
      throw new Error(`Sheet "${pageName}" not found`);
    }
    const sheetId = sheet.properties.sheetId;

    // Read the existing data
    const readRes = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: pageName,
    });
    let existingData = readRes.data.values || [];

    // Find the indices of rows to remove
    let rowsToDelete = [];
    existingData.forEach((row, index) => {
      if (ordersToRemove.some((order) => order["Order ID"] === row[7])) {
        rowsToDelete.push(index + 1);
      }
    });

    //sort so that rows shifting up dont interfere with batch deletes
    rowsToDelete.sort((a, b) => b - a);

    // Create requests for each row to delete
    let requests = rowsToDelete.map((rowIndex) => ({
      deleteDimension: {
        range: {
          sheetId: sheetId,
          dimension: "ROWS",
          startIndex: rowIndex - 1,
          endIndex: rowIndex,
        },
      },
    }));

    // Send batchUpdate to delete rows
    if (requests.length > 0) {
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId,
        resource: {
          requests: requests,
        },
      });
      console.log("Orders removed");
    } else {
      console.log("No orders to remove");
    }
  } catch (error) {
    console.error("The API returned an error: " + error);
  }
}

// Triggered by: Remove button in pending etransfer table > Admin
// Function very similar to confirm orders but only removes one row at a time and will re-adjust inventory to stop saving items for buyer
async function removeOrder(auth, pageName, orderID) {
  const sheets = google.sheets({ version: "v4", auth });
  const spreadsheetId = "1IZ6oZOa7XAHnQV0ZNSGX9aujS6ugAwc_rUjcGESuYmM";

  try {
    // Find the sheetId of the given pageName
    const sheet = (
      await sheets.spreadsheets.get({ spreadsheetId })
    ).data.sheets.find((s) => s.properties.title === pageName);
    if (!sheet) {
      throw new Error(`Sheet "${pageName}" not found`);
    }
    const sheetId = sheet.properties.sheetId;

    // Read the existing data
    const existingData =
      (
        await sheets.spreadsheets.values.get({
          spreadsheetId,
          range: pageName,
        })
      ).data.values || [];

    // Find the index of the row to remove
    const rowIndex = existingData.findIndex((row) => row[7] === orderID);
    if (rowIndex === -1) {
      console.log("Order not found");
      return;
    }

    // Create request to delete the row
    const request = {
      deleteDimension: {
        range: {
          sheetId: sheetId,
          dimension: "ROWS",
          startIndex: rowIndex,
          endIndex: rowIndex + 1,
        },
      },
    };

    // Send batchUpdate to delete the row
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      resource: {
        requests: [request],
      },
    });

    console.log("Order removed");
  } catch (error) {
    console.error("The API returned an error: " + error);
  }
}

// This is a function that finds the first empty row in <pageName> and appends <values>
async function appendData(auth, pageName, values) {
  const sheets = google.sheets({ version: "v4", auth });

  // 'A:A' indicates that we're checking the first column for the first empty row
  const range = `${pageName}!A:A`;

  try {
    // Get the values in the first column of the sheet
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: "1IZ6oZOa7XAHnQV0ZNSGX9aujS6ugAwc_rUjcGESuYmM",
      range: range,
    });

    // Find the first empty row based on the first column
    const firstEmptyRow = res.data.values ? res.data.values.length + 1 : 1;

    // Now that we have the first empty row, prepare the range to write
    const writeRange = `${pageName}!A${firstEmptyRow}`;

    // Append the data to the first empty row
    await sheets.spreadsheets.values.update({
      spreadsheetId: "1IZ6oZOa7XAHnQV0ZNSGX9aujS6ugAwc_rUjcGESuYmM",
      range: writeRange,
      valueInputOption: "USER_ENTERED",
      resource: {
        values: [values],
      },
    });

    console.log(`Data written to row ${firstEmptyRow} of ${pageName}`);
  } catch (error) {
    console.error("The API returned an error: " + error);
  }
}

module.exports = {
  appendData,
  readStore,
  readDataFromSheet,
  confirmOrders,
  removeOrder,
  authorize,
};
