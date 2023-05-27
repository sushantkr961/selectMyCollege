const exprss = require("express");
const controller = require("../controller/collegeController");
const router = exprss.Router();
const multer = require("multer");

// logo image upload Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/uploads");
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "-" + Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage }).single("clgLogo");

// Home page
router.get("/", controller.homePage);

// topclg page
router.get("/topclg", controller.topclgPage);

// view college page
router.get("/view", controller.viewPage);
router.get("/colleges/:id", controller.getCollegeById);

// admin page
router.get("/admin", controller.adminPage);

// add colleges
router
  .route("/addColleges")
  .get(controller.createCollegeView)
  .post(upload, controller.createCollege);
// add colleges part two
router.get("/addColleges/next", controller.createCollegeTwoView);
router.post("/addColleges/next", upload, controller.createCollegeTwo);
router.delete("/addColleges/next/:collegeId/:feeId", controller.deleteCourseTwo);

// update colleges
router
  .route("/updateCollege/:id")
  .get(controller.updateCollegeView)
  .put(upload, controller.updateCollege);

//delete colleges
router.delete("/colleges/:id", controller.deleteCollege);

// all colleges
router.get("/allColleges", controller.getAllColleges);

module.exports = router;
