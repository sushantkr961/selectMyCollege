const express = require("express");
const controller = require("../controller/alumniController");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

router
  .route("/admin/addColleges/next/alumni")
  .get(authMiddleware, controller.viewAlunmi)
  .post(authMiddleware, controller.createAlum);

router
  .route("/admin/addColleges/next/alumni/:id/:collegeId")
  .delete(authMiddleware, controller.deleteAlumni);

router
  .route("/admin/addColleges/next/alumni/edit/:id/:collegeId")
  .get(authMiddleware, controller.editAlumniView)
  .post(authMiddleware, controller.editAlum);

module.exports = router;
