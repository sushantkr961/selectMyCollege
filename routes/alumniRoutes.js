const express = require("express");
const controller = require("../controller/alumniController");
const router = express.Router();

router.get("/addColleges/next/alumni", controller.viewAlunmi);
router.post("/addColleges/next/alumni", controller.createAlum);
// router.post("/addColleges/next/alumni/:id?", controller.createOrUpdateAlum);
router.delete(
  "/addColleges/next/alumni/:id/:collegeId",
  controller.deleteAlumni
);
router.get("/addColleges/next/alumni/edit/:id", controller.editAlumniView);

module.exports = router;
