const express = require("express");
const controller = require("../controller/alumniController");
const router = express.Router();

router.get("/addColleges/next/alumni", controller.viewAlunmi);
router.post("/addColleges/next/alumni", controller.createAlum);
router.delete("/addColleges/next/alumni/:id/:collegeId", controller.deleteAlumni);

module.exports = router;
