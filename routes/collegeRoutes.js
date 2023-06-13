const express = require("express");
const controller = require("../controller/collegeController");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/multerConfig");

// Home page
router.get("/", controller.homePage);

// topclg page
router.get("/topclg", controller.topclgPage);

// view college page
router.get("/view/:collegeId", controller.viewPage);
// router.get("/colleges/:id", controller.getCollegeById);

// admin page
router.get("/admin", authMiddleware, controller.adminRoute);
router.get("/admin/dashboard", authMiddleware, controller.adminPage);

// add colleges
router
  .route("/admin/addColleges")
  .get(controller.createCollegeView)
  .post(upload.single("clgLogo"), controller.createCollege);

// add college gallery
router
  .route("/admin/addColleges/next/gallery")
  .get(controller.createImageGalleryView)
  .post(upload.array("clgLogo", 4), controller.createImageGallery);

router.delete(
  "/admin/addColleges/next/gallery/:collegeId/images/:imageId",
  controller.deleteImage
);

// update colleges
router
  .route("/admin/updateCollege/:id")
  .get(controller.updateCollegeView)
  .put(upload.single("clgLogo"), controller.updateCollege);

// delete colleges
router.delete("/admin/colleges/:id", controller.deleteCollege);

// all colleges
router.get("/allColleges", controller.getAllColleges);

module.exports = router;
