const Blog = require("../model/blogModel");

const blogsPage = async (req, res) => {
  res.render("blogs", { title: "selectmycollege" });
};

const blogsDetailPage = async (req, res) => {
  res.render("blogsDetail", { title: "selectmycollege" });
};

const createBlogView = async (req, res) => {
  res.render("admin/addBlog", { title: "selectmycollege" });
};

// Create a new blog
const createBlog = async (req, res) => {
  try {
    const { title, content, author, description } = req.body;
    const image = req.file.path; // Assuming the uploaded file path is stored in req.file.path

    const newBlog = await Blog.create({
      title,
      content,
      author,
      description,
      image,
    });

    req.session.message = {
      type: "success",
      message: "Blog created successfully",
    };
    res.redirect("/admin/allblog"); // Redirect to the blogs page or appropriate route
  } catch (error) {
    req.session.message = {
      type: "danger",
      message: "Failed to create blog",
    };
    res.redirect("/admin/allblog"); // Redirect to the blogs page or appropriate route
  }
};

// Get all blogs
const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find();
    res.render("admin/allBlogsAdmin", { title: "selectmycollege", blogs });
  } catch (error) {
    req.session.message = { type: "danger", message: "Failed to fetch blogs" };
    res.redirect("/admin/allblogsAdmin"); // Redirect to the blogs page or appropriate route
  }
};

// Get a single blog by ID
const getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      req.session.message = { type: "danger", message: "Blog not found" };
      res.redirect("/blogs"); // Redirect to the blogs page or appropriate route
    } else {
      res.status(200).json({ blog });
    }
  } catch (error) {
    req.session.message = { type: "danger", message: "Failed to fetch blog" };
    res.redirect("/blogs"); // Redirect to the blogs page or appropriate route
  }
};

// Update a blog by ID
const updateBlog = async (req, res) => {
  try {
    const { title, content, author, description, image } = req.body;
    const updatedBlog = await Blog.findByIdAndUpdate(
      req.params.id,
      { title, content, author, description, image },
      { new: true }
    );
    if (!updatedBlog) {
      req.session.message = { type: "danger", message: "Blog not found" };
      res.redirect("/blogs"); // Redirect to the blogs page or appropriate route
    } else {
      req.session.message = {
        type: "success",
        message: "Blog updated successfully",
      };
      res.redirect("/blogs"); // Redirect to the blogs page or appropriate route
    }
  } catch (error) {
    req.session.message = { type: "danger", message: "Failed to update blog" };
    res.redirect("/blogs"); // Redirect to the blogs page or appropriate route
  }
};

// Delete a blog by ID
const deleteBlog = async (req, res) => {
  try {
    const deletedBlog = await Blog.findByIdAndDelete(req.params.id);
    if (!deletedBlog) {
      req.session.message = { type: "danger", message: "Blog not found" };
      res.redirect("/blogs"); // Redirect to the blogs page or appropriate route
    } else {
      req.session.message = {
        type: "success",
        message: "Blog deleted successfully",
      };
      res.redirect("/blogs"); // Redirect to the blogs page or appropriate route
    }
  } catch (error) {
    req.session.message = { type: "danger", message: "Failed to delete blog" };
    res.redirect("/blogs"); // Redirect to the blogs page or appropriate route
  }
};

module.exports = {
  blogsPage,
  blogsDetailPage,
  createBlog,
  deleteBlog,
  updateBlog,
  getAllBlogs,
  getBlogById,
  createBlogView,
};
