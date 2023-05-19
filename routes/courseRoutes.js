const exprss = require("express");
const controller = require("../controller/courseController");
const router = exprss.Router();

// add courses
router.get("/addCourses", controller.addCoursesPage);

// view Courses
router.get("/viewCourses", controller.viewCoursesPage);

module.exports = router;
