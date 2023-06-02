const exprss = require("express");
const controller = require("../controller/courseController");
const router = exprss.Router();

router.get("/addColleges/next", controller.createCourseView);
router.post("/addColleges/next", controller.createCourse);
router.delete("/deletecolleges/:id/courses/:feeId", controller.deleteCourseTwo);
router.get("/editCollegeCouresView/:feeid", controller.editCollegeCourseView);
router.post("/editCollegeCouresView/:feeid", controller.editCollegeCourse);

module.exports = router;
