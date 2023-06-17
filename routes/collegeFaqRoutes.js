const express = require("express");
const controller = require("../controller/collegeFaqController");
const router = express.Router();

router
  .route("/admin/addColleges/next/FAQs")
  .get(controller.getAllCollegeFAQs)
  .post(controller.createCollegeFAQ);

router
  .route("/admin/addColleges/next/FAQs/:id/:collegeId")
  .get(controller.updateCollegeFAQView)
  .post(controller.updateCollegeFAQ)
  .delete(controller.deleteCollegeFAQ);

module.exports = router;
