const exprss = require("express");
const controller = require("../controller/blogController");
const upload = require("../middleware/multerConfig");
const router = exprss.Router();

// Blogs page
router.get("/blogs", controller.blogsPage);

// Blogs Detail page
router.get("/blogsDetail", controller.blogsDetailPage);

// Get all blogs
router.get("/admin/allblog", controller.getAllBlogs);

// Get a single blog by ID
router.get("/blog/:id", controller.getBlogById);

router
  .route("/admin/addColleges/next/blog/:id")
  .put(controller.updateBlog)
  .delete(controller.deleteBlog);

router
  .route("/admin/addColleges/next/blog")
  .get(controller.createBlogView)
  .post(upload.single("image"), controller.createBlog);

module.exports = router;
