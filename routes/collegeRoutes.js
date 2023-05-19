const exprss = require("express");
const controller = require("../controller/collegeController");
const router = exprss.Router();

// Home page
router.get("/", controller.homePage);

// topclg page
router.get("/topclg", controller.topclgPage);

// view college page
router.get("/view", controller.viewPage);

// admin page
router.get("/admin", controller.adminPage);

// add colleges
// router.get("/addColleges", controller.createCollege);
router.post("/addColleges",controller.createCollege)

// all colleges
router.get("/allColleges", controller.getAllColleges);

module.exports = router;
