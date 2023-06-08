const express = require("express");
const controller = require("../controller/alumniController");
const router = express.Router();

router
  .route("/admin/addColleges/next/alumni")
  .get(controller.viewAlunmi)
  .post(controller.createAlum);

router
  .route("/admin/addColleges/next/alumni/:id/:collegeId")
  .delete(controller.deleteAlumni);

router
  .route("/admin/addColleges/next/alumni/edit/:id/:collegeId")
  .get(controller.editAlumniView)
  .post(controller.editAlum);

module.exports = router;
