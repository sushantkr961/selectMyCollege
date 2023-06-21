const exprss = require("express");
const controller = require("../controller/courseController");
const authMiddleware = require("../middleware/authMiddleware");
const router = exprss.Router();

router
  .route("/admin/addColleges/next")
  .get(authMiddleware, controller.createCourseView)
  .post(authMiddleware, controller.createCourse);

router
  .route("/admin/deletecolleges/:id/courses/:feeId")
  .delete(authMiddleware, controller.deleteCourseTwo);

router
  .route("/admin/editCollegeCouresView/:feeid")
  .get(authMiddleware, controller.editCollegeCourseView)
  .post(authMiddleware, controller.editCollegeCourse);

router
  .route("/admin/allCourses/:id")
  .delete(authMiddleware, controller.deleteCourse);

router
  .route("/admin/courses/:id")
  .get(authMiddleware, controller.updateCourseView)
  .put(authMiddleware, controller.updateCourse);

router
  .route("/admin/allCourses")
  .get(authMiddleware, controller.allCoursesView);
router.get("/getsubcourse/:id", controller.getsubcourse);

module.exports = router;
