const express = require("express");
const web = express();

const leadsRoutes = require("./leadsRoutes");
const collegeRoutes = require("./collegeRoutes");
const blogRoutes = require("./blogRoutes");
const alumniRoutes = require("./alumniRoutes");
const cityRoutes = require("./cityRoutes");
const stateRoutes = require("./stateRoutes");
const courseRoutes = require("./courseRoutes");

// college page
web.use("/", collegeRoutes);

// blogs page
web.use("/", blogRoutes);

// alumni page
web.use("/", alumniRoutes);

// leads
web.use("/", leadsRoutes);

//city route
web.use("/", cityRoutes);

// state route
web.use("/", stateRoutes);

// course route
web.use("/", courseRoutes);

module.exports = web;
