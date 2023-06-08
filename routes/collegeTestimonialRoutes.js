const express = require("express");
const controller = require("../controller/collegeTestimonialController");
const router = express.Router();

router
  .route("/admin/addColleges/next/testimonial")
  .get(controller.collegeTestimonialView)
  .post(controller.createCollegeTestimonial);

router
  .route("/admin/addColleges/next/testimonial/:id/:collegeId")
  .delete(controller.deleteCollegeTestimonial);

router
  .route("/admin/addColleges/next/testimonial/edit/:id/:collegeId")
  .get(controller.editCollegeTestimonialView)
  .post(controller.editCollegeTestimonial);

module.exports = router;
