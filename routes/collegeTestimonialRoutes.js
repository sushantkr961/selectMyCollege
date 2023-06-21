const express = require("express");
const controller = require("../controller/collegeTestimonialController");
const upload = require("../middleware/multerConfig");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

router
  .route("/admin/addColleges/next/testimonial")
  .get(authMiddleware, controller.collegeTestimonialView)
  .post(
    authMiddleware,
    upload.single("clgLogo"),
    controller.createCollegeTestimonial
  );

router
  .route("/admin/addColleges/next/testimonial/:id/:collegeId")
  .delete(authMiddleware, controller.deleteCollegeTestimonial);

router
  .route("/admin/addColleges/next/testimonial/edit/:id/:collegeId")
  .get(authMiddleware, controller.editCollegeTestimonialView)
  .post(
    authMiddleware,
    upload.single("clgLogo"),
    controller.editCollegeTestimonial
  );

module.exports = router;
