const express = require("express");
const controller = require("../controller/collegeFaqController");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

router
  .route("/admin/addColleges/next/FAQs")
  .get(authMiddleware, controller.getAllCollegeFAQs)
  .post(authMiddleware, controller.createCollegeFAQ);

router
  .route("/admin/addColleges/next/FAQs/:id/:collegeId")
  .get(authMiddleware, controller.updateCollegeFAQView)
  .post(authMiddleware, controller.updateCollegeFAQ)
  .delete(authMiddleware, controller.deleteCollegeFAQ);

module.exports = router;
