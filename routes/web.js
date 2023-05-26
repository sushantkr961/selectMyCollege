const express = require("express");
const web = express();

const courseRoutes = require("./courseRoutes");
const leadsRoutes = require("./leadsRoutes");
const collegeRoutes = require("./collegeRoutes");
const blogRoutes = require("./blogRoutes");
const alumniRoutes = require("./alumniRoutes");
const feeRoutes = require("./feeRoutes");

// college page
web.use("/", collegeRoutes);

// courses page
web.use("/", courseRoutes);

// blogs page
web.use("/", blogRoutes);

// alumni page
web.use("/", alumniRoutes);

// leads
web.use("/", leadsRoutes);

// fee route
web.use("/", feeRoutes);

module.exports = web;
