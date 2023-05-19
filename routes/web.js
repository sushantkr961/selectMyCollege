const express = require("express");
const web = express();

const courseRoutes = require("./courseRoutes");
const leadsRoutes = require("./leadsRoutes");
const collegeRoutes = require("./collegeRoutes");
const blogRoutes = require("./blogRoutes")
const alumniRoutes = require("./alumniRoutes")

// college page
web.use("/", collegeRoutes);

// courses page
web.use("/", courseRoutes);

// blogs page
web.use("/",blogRoutes)

// alumni page
web.use("/",alumniRoutes)

// leads
web.use("/",leadsRoutes)

module.exports = web;
