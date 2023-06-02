const express = require("express");
const controller = require("../controller/alumniController");
const router = express.Router();

router.get("/addColleges/next/alumni", controller.viewAlunmi);
router.post("/addColleges/next/alumni", controller.createAlum);
router.delete(
  "/addColleges/next/alumni/:id/:collegeId",
  controller.deleteAlumni
);
router.get("/addColleges/next/alumni/edit/:id/:collegeId", controller.editAlumniView);
router.post(
  "/addColleges/next/alumni/edit/:id/:collegeId",
  controller.editAlum
);

module.exports = router;
