const exprss = require("express");
const controller = require("../controller/courseController");
const router = exprss.Router();

// add courses
router.get("/addCourses", controller.addCoursesPageView);

// view Courses
router.get("/viewCourses", controller.viewCoursesPageView);

// edit course
router.get("/editCourse", controller.editCourseView);

router.get("/allcourse", controller.getAllCourses);
router.post("/addCourse", controller.postCourses);
router.delete("/courses/:id", controller.deleteCourse);
router.post("/addSem", controller.saveAttr);

module.exports = router;
