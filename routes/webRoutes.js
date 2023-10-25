const express = require("express");
const router = express.Router();

const controller = require("../controller/adminController");
const controllerW = require("../controller/webController");

router.route("/login").get(controller.loginView).post(controller.login);
router.get("/logout", controller.logout);
router.get("/blogs", controller.blogsPage);
router.get("/blog/:id", controllerW.getBlogById);
router.get("/", controllerW.homePage);
router.get("/view/:collegeId", controllerW.viewPage);
router.get("/colleges", controllerW.getAllColleges);
router.get("/fc", controllerW.fc);
router.get("/getsubcourse/:id", controllerW.getsubcourse);
router.post("/admin/leads", controllerW.createLead);
router.get("/testimonials", controllerW.getAllWebTestimonials);

module.exports = router;
