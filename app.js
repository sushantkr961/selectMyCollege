require("dotenv").config();
const express = require("express");
const web = require("./routes/web");

const app = express();
const PORT = process.env.PORT;

// MongoDB Connection
require("./database/db");

// accessing public directory
app.use(express.static("public"));


// implementing view using ejs
app.set("view engine", "ejs");
app.set("views", "./views");

// Routes
app.use("", web);

// listning on port
app.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`);
});
