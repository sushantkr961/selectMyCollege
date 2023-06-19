const express = require("express");
const upload = require("../middleware/multerConfig");
const Controller = require("../controller/websiteBannerController");
const router = express.Router();

router
  .route("/admin/banner")
  .get(Controller.UploadBannerView)
  .post(upload.array("clgLogo", 4), Controller.uploadBannerImage);

router.delete("/admin/banner/:id", Controller.deleteGalleryImage);

module.exports = router;
