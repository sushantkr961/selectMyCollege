const express = require("express");
const controller = require("../controller/websiteTestimonialController");
const upload = require("../middleware/multerConfig");
const router = express.Router();

router.get("/testimonials", controller.getAllWebTestimonials);
router
  .route("/admin/testimonial")
  .get(controller.createWebsiteTestimonialView)
  .post(upload.single("clgLogo"), controller.createWebsiteTestimonial);

router
  .route("/admin/testimonial/:id")
  .get(controller.editWebsiteTestimonialView)
  .delete(controller.deleteWebsiteTestimonial)
  .post(upload.single("clgLogo"), controller.editWebsiteTestimonial);

module.exports = router;
