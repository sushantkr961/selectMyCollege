const exprss = require("express");
const controller = require("../controller/collegeController");
const router = exprss.Router();
const multer = require("multer");

// logo image upload Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads");
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

// admin page
router.get("/admin", controller.adminPage);

// add colleges
router.post("/addColleges", upload, controller.createCollege);
router.get("/addColleges", controller.createCollegeView);
router.delete("/colleges/:id", controller.deleteCollege);
router.get("/updateCollege/:id", controller.updateCollegeView);
router.put("/updateCollege/:id", upload, controller.updateCollege);

// all colleges
router.get("/allColleges", controller.getAllColleges);

module.exports = router;
