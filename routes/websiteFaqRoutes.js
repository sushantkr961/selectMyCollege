const express = require("express");
const router = express.Router();
const controller = require("../controller/websiteFaqController");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/admin/allFaqs", authMiddleware, controller.getAllFAQs);

router
  .route("/admin/faqs")
  .get(authMiddleware, controller.createFAQView)
  .post(authMiddleware, controller.createFAQ);

router
  .route("/admin/faqs/:id")
  .get(authMiddleware, controller.updateFAQView)
  .post(authMiddleware, controller.updateFAQ)
  .delete(authMiddleware, controller.deleteFAQ);

module.exports = router;
