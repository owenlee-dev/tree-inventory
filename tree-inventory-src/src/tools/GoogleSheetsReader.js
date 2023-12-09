const fs = require("fs").promises;
const path = require("path");
const process = require("process");
const { authenticate } = require("@google-cloud/local-auth");
const { google } = require("googleapis");

// If modifying these scopes, delete token.json.
const SCOPES = ["https://www.googleapis.com/auth/spreadsheets.readonly"];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = path.join(process.cwd(), "../assets/token.json");
const CREDENTIALS_PATH = path.join(process.cwd(), "../assets/credentials.json");

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

async function organizeData(data) {
  const organizedData = {};
  let currentCategory = "";
  let currentSubcategory = "";
  let isDirectItemUnderCategory = false;

  data.forEach((item) => {
    // Check if the item is a main category (all uppercase)
    if (item.Variety === item.Variety.toUpperCase()) {
      currentCategory = item.Variety.toLowerCase(); // Convert category to lowercase
      organizedData[currentCategory] = {};
      currentSubcategory = "";
      isDirectItemUnderCategory = true;
    } else if (currentCategory) {
      // Check if the item is a subcategory (not all uppercase and not a detailed item)
      if (
        item.Variety !== item.Variety.toUpperCase() &&
        Object.keys(item).length <= 2
      ) {
        currentSubcategory = item.Variety.toLowerCase().trim(); // Convert subcategory to lowercase and trim
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
/**
 * Prints the names and majors of students in a sample spreadsheet:
 * @see https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
 * @param {google.auth.OAuth2} auth The authenticated Google OAuth client.
 */
async function readSheet(auth) {
  const sheets = google.sheets({ version: "v4", auth });
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: "1IZ6oZOa7XAHnQV0ZNSGX9aujS6ugAwc_rUjcGESuYmM",
    range: "Sheet1",
  });
  console.log(res.data.values[0]);
  let dataAsObjects = await dataToObjects(res.data.values);
  let organizedData = await organizeData(dataAsObjects);
  const jsonContent = JSON.stringify(organizedData, null, 2);

  // Write to a file

  console.log(organizedData);
  const rows = res;
  if (!rows || rows.length === 0) {
    console.log("No data found.");
    return;
  }
}

authorize().then(readSheet).catch(console.error);
