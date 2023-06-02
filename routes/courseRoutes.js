const exprss = require("express");
const controller = require("../controller/courseController");
const router = exprss.Router();

router
  .route("/addColleges/next")
  .get(controller.createCourseView)
  .post(controller.createCourse);

router
  .route("/deletecolleges/:id/courses/:feeId")
  .delete(controller.deleteCourseTwo);

router
  .route("/editCollegeCouresView/:feeid")
  .get(controller.editCollegeCourseView)
  .post(controller.editCollegeCourse);

module.exports = router;
