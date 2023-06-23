const express = require("express");
const web = express();

const leadsRoutes = require("./leadsRoutes");
const collegeRoutes = require("./collegeRoutes");
const blogRoutes = require("./blogRoutes");
const alumniRoutes = require("./alumniRoutes");
const courseRoutes = require("./courseRoutes");
const collegeTestimonialRoutes = require("./collegeTestimonialRoutes");
const userRoutes = require("./userRoutes");
const websiteTestimonialRoutes = require("./websiteTestimonialRoutes");
const websiteFAQsRoutes = require("./websiteFaqRoutes");
const collegeFAQsRoutes = require("./collegeFaqRoutes");
const webBannerRoutes = require("./webstieBannerRoutes");

// college page
web.use("/", collegeRoutes);

// blogs page
web.use("/", blogRoutes);

// alumni page
web.use("/", alumniRoutes);

// leads
web.use("/", leadsRoutes);

// user route
web.use("/", userRoutes);

// course route
web.use("/", courseRoutes);

// college testimonial
web.use("/", collegeTestimonialRoutes);

// website testimonial
web.use("/", websiteTestimonialRoutes);

// college testimonial
web.use("/", collegeFAQsRoutes);

// Website Faqs
web.use("/", websiteFAQsRoutes);

// Website Routes
web.use("/", webBannerRoutes);

module.exports = web;
