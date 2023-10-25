const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();
const upload = require("../middleware/multerConfig");

const controller = require("../controller/adminController");

router
  .route("/admin/addColleges/next/alumni")
  .get(authMiddleware, controller.viewAlunmi)
  .post(authMiddleware, controller.createAlum);

router
  .route("/admin/addColleges/next/alumni/:id/:collegeId")
  .delete(authMiddleware, controller.deleteAlumni);

router
  .route("/admin/addColleges/next/alumni/edit/:id/:collegeId")
  .get(authMiddleware, controller.editAlumniView)
  .post(authMiddleware, controller.editAlum);

router
  .route("/admin/addColleges/next/blog/:id")
  .get(authMiddleware, controller.updateBlogView)
  .post(authMiddleware, upload.single("image"), controller.updateBlog)
  .delete(authMiddleware, controller.deleteBlog);

router
  .route("/admin/addColleges/next/blog")
  .get(authMiddleware, controller.createBlogView)
  .post(authMiddleware, upload.single("image"), controller.createBlog);

router.get("/admin/allblog", authMiddleware, controller.getAllBlogs);

router
  .route("/admin/addColleges/next/FAQs")
  .get(authMiddleware, controller.getAllCollegeFAQs)
  .post(authMiddleware, controller.createCollegeFAQ);

router
  .route("/admin/addColleges/next/FAQs/:id/:collegeId")
  .get(authMiddleware, controller.updateCollegeFAQView)
  .post(authMiddleware, controller.updateCollegeFAQ)
  .delete(authMiddleware, controller.deleteCollegeFAQ);

router.get("/admin", authMiddleware, controller.adminRoute);
router.get("/admin/dashboard", authMiddleware, controller.adminPage);

router
  .route("/admin/addColleges")
  .get(authMiddleware, controller.createCollegeView)
  .post(authMiddleware, upload.single("clgLogo"), controller.createCollege);

router
  .route("/admin/addColleges/next/gallery")
  .get(authMiddleware, controller.createImageGalleryView)
  .post(
    authMiddleware,
    upload.array("clgLogo", 4),
    controller.createImageGallery
  );

router.delete(
  "/admin/addColleges/next/gallery/:collegeId/images/:imageId",
  authMiddleware,
  controller.deleteImage
);

router
  .route("/admin/updateCollege/:id")
  .get(authMiddleware, controller.updateCollegeView)
  .put(authMiddleware, upload.single("clgLogo"), controller.updateCollege);

router.delete("/admin/colleges/:id", authMiddleware, controller.deleteCollege);

router.get(
  "/admin/allColleges",
  authMiddleware,
  controller.getAllCollegesAdmin
);

router
  .route("/admin/addColleges/next/testimonial")
  .get(authMiddleware, controller.collegeTestimonialView)
  .post(
    authMiddleware,
    upload.single("clgLogo"),
    controller.createCollegeTestimonial
  );

router
  .route("/admin/addColleges/next/testimonial/:id/:collegeId")
  .delete(authMiddleware, controller.deleteCollegeTestimonial);

router
  .route("/admin/addColleges/next/testimonial/edit/:id/:collegeId")
  .get(authMiddleware, controller.editCollegeTestimonialView)
  .post(
    authMiddleware,
    upload.single("clgLogo"),
    controller.editCollegeTestimonial
  );

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

router.route("/admin/leads").get(authMiddleware, controller.leadsPage);

router.get("/admin/allAdmin", authMiddleware, controller.allAdmin);

router.delete("/admin/deladmin/:id", authMiddleware, controller.deleteAdmin);

router.get("/admin/register", authMiddleware, controller.registerView);
router.post("/admin/register", authMiddleware, controller.register);
router.get("/admin/allFaqs", authMiddleware, controller.getAllFAQs);

router
  .route("/admin/faqs")
  .get(authMiddleware, controller.createFAQView)
  .post(authMiddleware, controller.createFAQ);

router
  .route("/admin/faqs/:id")
  .get(authMiddleware, controller.updateFAQView)
  .post(authMiddleware, controller.updateFAQ)
  .delete(authMiddleware, controller.deleteFAQ);

router
  .route("/admin/testimonial")
  .get(authMiddleware, controller.createWebsiteTestimonialView)
  .post(
    authMiddleware,
    upload.single("clgLogo"),
    controller.createWebsiteTestimonial
  );

router
  .route("/admin/testimonial/:id")
  .get(authMiddleware, controller.editWebsiteTestimonialView)
  .delete(authMiddleware, controller.deleteWebsiteTestimonial)
  .post(
    authMiddleware,
    upload.single("clgLogo"),
    controller.editWebsiteTestimonial
  );

router
  .route("/admin/banner")
  .get(authMiddleware, controller.UploadBannerView)
  .post(
    authMiddleware,
    upload.array("clgLogo", 4),
    controller.uploadBannerImage
  );

router
  .route("/admin/banner/:id")
  .delete(authMiddleware, controller.deleteGalleryImage);

module.exports = router;
