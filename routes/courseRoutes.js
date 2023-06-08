const exprss = require("express");
const controller = require("../controller/courseController");
const router = exprss.Router();

router
  .route("/admin/addColleges/next")
  .get(controller.createCourseView)
  .post(controller.createCourse);

router
  .route("/admin/deletecolleges/:id/courses/:feeId")
  .delete(controller.deleteCourseTwo);

router
  .route("/admin/editCollegeCouresView/:feeid")
  .get(controller.editCollegeCourseView)
  .post(controller.editCollegeCourse);

router.route("/allCourses").get(controller.allCoursesView);

router.route("/admin/allCourses/:id").delete(controller.deleteCourse);

router
  .route("/admin/courses/:id")
  .get(controller.updateCourseView)
  .put(controller.updateCourse);

router.get('/getsubcourse/:id',controller.getsubcourse);

module.exports = router;
