const express = require("express");
const process = require("process");
const {
  authorize,
  readStore,
  readDataFromSheet,
  getOrderDetails,
  updateInventory,
  appendData,
  confirmOrders,
  removeOrder,
} = require("./utility/GoogleSheetsAPI");
const app = express();
const cors = require("cors");
app.use(express.json());
const port = process.env.PORT || 8080;
const env = require("dotenv").config({ path: "../.env" });
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const corsOptions = {
  origin: "https://maple-grove-permaculture.vercel.app",
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

//GOOGLE SHEETS
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

app.get("/about", (req, res) => {
  res.json({ apiKey: process.env.GOOGLE_MAPS_API_KEY });
});

app.get("/google-sheets/store-data", async (req, res) => {
  try {
    //error in authorize
    const auth = await authorize();
    const data = await readStore(auth, "Store");
    res.json(data);
  } catch (error) {
    console.error(
      "server.js: The API returned an error while fetching store data: " + error
    );
    res.status(500).send("Error retrieving data");
  }
});
app.get("/google-sheets/pickup-locations", async (req, res) => {
  try {
    const auth = await authorize();
    const data = await readDataFromSheet(auth, "Pickup-Locations");
    res.json(data);
  } catch (error) {
    console.error(
      "server.js: The API returned an error when fetching pickup locations: " +
        error
    );
    res.status(500).send("Error retrieving pickup locations");
  }
});

app.post("/google-sheets/get-order-details", async (req, res) => {
  try {
    const orderID = req.body.orderID;
    if (!orderID) {
      return res.status(400).send("OrderID is required");
    }

    const auth = await authorize();
    const orderDetails = await getOrderDetails(auth, orderID);

    if (orderDetails) {
      res.json(orderDetails);
    } else {
      res.status(404).send("Order not found");
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/google-sheets/pending-etransfers", async (req, res) => {
  try {
    const auth = await authorize();
    const data = await readDataFromSheet(auth, "Pending-E-Transfers");
    res.json(data);
  } catch (error) {
    console.error(
      "server.js: The API returned an error when fetching pending etransfers: " +
        error
    );
    res.status(500).send("Error retrieving pickup locations");
  }
});

app.get("/google-sheets/valid-coupons", async (req, res) => {
  try {
    const auth = await authorize();
    const data = await readDataFromSheet(auth, "Coupons");
    res.json(data);
  } catch (error) {
    console.error(
      "server.js: The API returned an error when fetching pending etransfers: " +
        error
    );
    res.status(500).send("Error retrieving valid coupons ");
  }
});

app.post("/google-sheets/add-coupon", async (req, res) => {
  try {
    const auth = await authorize();
    await appendData(auth, "Coupons", Object.values(req.body));
  } catch (error) {
    console.error(
      "server.js: The API returned an error when adding a coupon: " + error
    );
    res.status(500).send("Error retrieving pickup locations");
  }
});

app.post("/google-sheets/confirm-orders", async (req, res) => {
  try {
    const auth = await authorize();
    await confirmOrders(auth, "Pending-E-Transfers", req.body);
    res.status(200).json({ message: "Orders confirmed successfully." });
  } catch (error) {
    console.error(
      "server.js: The API returned an error when confirming etransfer orders: " +
        error
    );
  }
});

app.post("/google-sheets/remove-order", async (req, res) => {
  try {
    const auth = await authorize();
    await removeOrder(auth, "Pending-E-Transfers", req.body.orderID);
    res.status(200).json({ message: "Order Removed Successfully." });
  } catch (error) {
    console.error(
      "server.js: The API returned an error when removing an order: " + error
    );
  }
});

app.post("/google-sheets/add-report", async (req, res) => {
  try {
    const reportData = Object.values(req.body);
    const auth = await authorize();
    await appendData(auth, "Order-Reports", reportData);
    // res.json(data);
  } catch (error) {
    console.error(
      "server.js: The API returned an error when adding a report: " + error
    );
    res.status(500).send("Error retrieving report data");
  }
});

app.post("/google-sheets/update-inventory", async (req, res) => {
  try {
    const itemsPurchased = req.body.itemsPurchased;
    const reduceInventory = req.body.reduceInventory;

    if (!itemsPurchased || reduceInventory === undefined) {
      return res.status(400).send("Missing required parameters");
    }

    const auth = await authorize();
    await updateInventory(auth, itemsPurchased, reduceInventory);

    res.json({ message: "Inventory updated successfully" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
});

//TODO make sure everything gets added in lower case
app.post("/google-sheets/add-pending-etransfer", async (req, res) => {
  try {
    const reportData = Object.values(req.body);
    const auth = await authorize();
    await appendData(auth, "Pending-E-Transfers", reportData);
  } catch (error) {
    console.error(
      "server.js: The API returned an error when adding a pending E-transfer: " +
        error
    );
    res.status(500).send("Error retrieving report data");
  }
});

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//STRIPE
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
app.get("/config", (req, res) => {
  res.send({
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
  });
});

app.post("/stripe/create-payment-intent", async (req, res) => {
  try {
    const { amount } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      currency: "CAD",
      amount: amount,
      automatic_payment_methods: { enabled: true },
    });

    res.send({ clientSecret: paymentIntent.client_secret });
  } catch (e) {
    res.status(400).send({ error: { message: e.message } });
  }
});
app.listen(port, () => console.log(`Node server listening at ${port}`));
