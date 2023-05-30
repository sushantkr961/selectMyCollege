const express = require("express");
const web = express();

const leadsRoutes = require("./leadsRoutes");
const collegeRoutes = require("./collegeRoutes");
const blogRoutes = require("./blogRoutes");
const alumniRoutes = require("./alumniRoutes");
const feeRoutes = require("./feeRoutes");
const cityRoutes = require("./cityRoutes");
const stateRoutes = require("./stateRoutes");

// college page
web.use("/", collegeRoutes);

// blogs page
web.use("/", blogRoutes);

// alumni page
web.use("/", alumniRoutes);

// leads
web.use("/", leadsRoutes);

// fee route
web.use("/", feeRoutes);

//city route
web.use("/", cityRoutes);

// state route
web.use("/", stateRoutes);

module.exports = web;
