const express = require("express");
const web = express();

const adminRoutes = require("./adminRoutes");
const webRoutes = require("./webRoutes");

web.use("/", adminRoutes);
web.use("/", webRoutes);

module.exports = web;
