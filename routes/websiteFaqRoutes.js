const express = require("express");
const router = express.Router();
const controller = require("../controller/websiteFaqController");

router.get("/faqs", controller.getAllFAQs);

router
  .route("/admin/faqs")
  .get(controller.createFAQView)
  .post(controller.createFAQ);

router
  .route("/admin/faqs/:id")
  .get(controller.updateFAQView)
  .post(controller.updateFAQ)
  .delete(controller.deleteFAQ);

module.exports = router;
