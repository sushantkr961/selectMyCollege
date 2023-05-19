const exprss = require("express");
const controller = require("../controller/blogController");
const router = exprss.Router();

// Blogs page
router.get("/blogs", controller.blogsPage);

// Blogs Detail page
router.get("/blogsDetail",controller.blogsDetailPage);


module.exports = router;