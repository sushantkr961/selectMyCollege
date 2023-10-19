require("dotenv").config();
const express = require("express");
const web = require("./routes/web");
const session = require("express-session");
const flash = require("connect-flash");
const methodOverride = require("method-override");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT;

// middlewares
app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(flash());
app.use(cors());

app.use(
  session({
    secret: "my secret key",
    saveUninitialized: true,
    resave: false,
  })
);

app.use((req, res, next) => {
  res.locals.message = req.session.message;
  delete req.session.message;
  next();
});

// Routes
app.use("", web);

// MongoDB Connection
require("./database/db");

// accessing public directory
app.use(express.static("public"));

// implementing view using ejs
app.set("view engine", "ejs");
app.set("views", "./views");

const start = async () => {
  try {
    app.listen(PORT, () => {
      console.log(`PORT Yes I am connected http://localhost:${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};
start();

// PORT=8080
// MONGO_URI=mongodb+srv://sushantpantheon:Sushant123@cluster0.uqswkar.mongodb.net/selectMyCollege?retryWrites=true&w=majority
// APP_URL=http://localhost:8080/
