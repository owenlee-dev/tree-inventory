const express = require("express");
const fs = require("fs").promises;
const path = require("path");
const process = require("process");
const { authenticate } = require("@google-cloud/local-auth");
const { google } = require("googleapis");
const { authorize, readSheet } = require("./utility/GoogleSheetsReader");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 3001;
app.use(cors());

app.get("/api/store-data", async (req, res) => {
  try {
    const auth = await authorize();
    const data = await readSheet(auth, "Store");
    res.json(data);
  } catch (error) {
    console.error("The API returned an error: " + error);
    res.status(500).send("Error retrieving data");
  }
});
app.get("/api/test-api", async (req, res) => {
  try {
    res.json("THIS IS A SUCCESSFUL TEST");
  } catch (error) {
    console.error("The API returned an error: " + error);
    res.status(500).send("Error retrieving data");
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
