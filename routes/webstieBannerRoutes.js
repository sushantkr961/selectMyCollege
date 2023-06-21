const express = require("express");
const upload = require("../middleware/multerConfig");
const Controller = require("../controller/websiteBannerController");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

router
  .route("/admin/banner")
  .get(authMiddleware, Controller.UploadBannerView)
  .post(
    authMiddleware,
    upload.array("clgLogo", 4),
    Controller.uploadBannerImage
  );

router
  .route("/admin/banner/:id")
  .delete(authMiddleware, Controller.deleteGalleryImage);

module.exports = router;
