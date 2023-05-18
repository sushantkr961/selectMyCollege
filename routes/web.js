const exprss = require("express");
const controller = require("../controller/collegeController");
const web = exprss.Router();

// Home page
web.get("/", controller.homePage);

// Blogs page
web.get("/blogs", controller.blogsPage);

// Blogs Detail page
web.get("/blogsDetail", controller.blogsDetailPage);

// topclg page
web.get("/topclg", controller.topclgPage);

// view college page
web.get("/view", controller.viewPage);

// admin page
web.get("/admin", controller.adminPage)

// add colleges
web.get("/addColleges",controller.addCollegesPage)

// all colleges
web.get("/allColleges",controller.allCollegesPage)

// add courses
web.get("/addCourses",controller.addCoursesPage)

// view Courses
web.get("/viewCourses",controller.viewCoursesPage)

// leads
web.get("/leads",controller.leadsPage)


module.exports = web;
