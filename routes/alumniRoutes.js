const express = require("express");
const controller = require("../controller/alumniController");
const router = express.Router();

router
  .route("/addColleges/next/alumni")
  .get(controller.viewAlunmi)
  .post(controller.createAlum);

router
  .route("/addColleges/next/alumni/:id/:collegeId")
  .delete(controller.deleteAlumni);

router
  .route("/addColleges/next/alumni/edit/:id/:collegeId")
  .get(controller.editAlumniView)
  .post(controller.editAlum);

module.exports = router;
