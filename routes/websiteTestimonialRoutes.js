const express = require("express");
const controller = require("../controller/websiteTestimonialController");
const upload = require("../middleware/multerConfig");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

router.get("/testimonials", controller.getAllWebTestimonials);
router
  .route("/admin/testimonial")
  .get(authMiddleware, controller.createWebsiteTestimonialView)
  .post(
    authMiddleware,
    upload.single("clgLogo"),
    controller.createWebsiteTestimonial
  );

router
  .route("/admin/testimonial/:id")
  .get(authMiddleware, controller.editWebsiteTestimonialView)
  .delete(authMiddleware, controller.deleteWebsiteTestimonial)
  .post(
    authMiddleware,
    upload.single("clgLogo"),
    controller.editWebsiteTestimonial
  );

module.exports = router;
