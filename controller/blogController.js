const Blog = require("../model/blogModel");

const blogsPage = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 5;
  const skip = (page - 1) * limit;
  const searchQuery = req.query.search;

  try {
    let query = {};
    if (searchQuery) {
      query = { title: { $regex: searchQuery, $options: "i" } };
    }

    const totalBlogs = await Blog.countDocuments(query);
    const totalPages = Math.ceil(totalBlogs / limit);

    const blogs = await Blog.find(query).skip(skip).limit(limit);

    res.render("blogs", {
      title: "selectmycollege",
      blogs,
      totalPages,
      currentPage: page,
      searchQuery,
    });
  } catch (error) {
    console.error("Failed to fetch blogs:", error);
    req.session.message = { type: "danger", text: "Failed to fetch blogs" };
    res.redirect("/blogs");
  }
};

const createBlogView = async (req, res) => {
  res.render("admin/addBlog", { title: "selectmycollege" });
};

// Create a new blog
const createBlog = async (req, res) => {
  try {
    const { title, content, author, description } = req.body;
    // const image = req.file.path;
    const newBlog = await Blog.create({
      title,
      content,
      author,
      description,
      image: "uploads/" + req.file.filename,
    });

    req.session.message = {
      type: "success",
      message: "Blog created successfully",
    };
    res.redirect("/admin/allblog");
  } catch (error) {
    req.session.message = {
      type: "danger",
      message: "Failed to create blog",
    };
    res.redirect("/admin/allblog");
  }
};

// Get all blogs
const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find();
    res.render("admin/allBlogsAdmin", { title: "selectmycollege", blogs });
  } catch (error) {
    req.session.message = { type: "danger", message: "Failed to fetch blogs" };
    res.redirect("/admin/allblog");
  }
};

// Get a single blog by ID
const getBlogById = async (req, res) => {
  const suggestedBlogs = await Blog.find().limit(3);
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      req.session.message = { type: "danger", message: "Blog not found" };
    }
    res.render("blogsDetail", {
      title: "selectmycollege",
      blog,
      suggestedBlogs,
    });
  } catch (error) {
    req.session.message = { type: "danger", message: "Failed to fetch blog" };
    res.redirect("/blogs");
  }
};

const updateBlogView = async (req, res) => {
  const { id } = req.params;
  try {
    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).send("Blog not found");
    }
    res.render("admin/editBlog", {
      title: "selectmycollege Admin",
      blog,
    });
  } catch (error) {
    console.error(error);
    req.session.message = {
      type: "danger",
      message: "Internal Server Error",
    };
    return res.redirect(`/admin/allblog`);
  }
};

// Update a blog by ID
const updateBlog = async (req, res) => {
  const { id } = req.params;
  const { title, content, author, description } = req.body;
  try {
    const oldBlog = await Blog.findById(id);
    let new_logo = "";
    if (!oldBlog) {
      req.session.message = { type: "danger", message: "Blog not found" };
      return res.redirect("/admin/allblog");
    }
    if (req.file) {
      new_logo = "uploads/" + req.file.filename;
      try {
        fs.unlinkSync("public/" + req.body.old_clgLogo);
      } catch (error) {
        console.log(error);
      }
    } else {
      new_logo = req.body.old_clgLogo;
    }
    const updatedBlog = await Blog.findByIdAndUpdate(
      id,
      { title, content, author, description, image: new_logo },
      { new: true }
    );
    req.session.message = {
      type: "success",
      message: "Blog updated successfully",
    };
    return res.redirect("/admin/allblog");
  } catch (error) {
    console.error(error);
    req.session.message = {
      type: "danger",
      message: "Internal Server Error",
    };
    return res.redirect("/admin/allblog");
  }
};

// Delete a blog by ID
const deleteBlog = async (req, res) => {
  try {
    const deletedBlog = await Blog.findByIdAndDelete(req.params.id);
    if (!deletedBlog) {
      req.session.message = { type: "danger", message: "Blog not found" };
      res.redirect("/admin/allblog");
    } else {
      req.session.message = {
        type: "success",
        message: "Blog deleted successfully",
      };
      res.redirect("/admin/allblog");
    }
  } catch (error) {
    req.session.message = { type: "danger", message: "Failed to delete blog" };
    res.redirect("/admin/allblog");
  }
};

module.exports = {
  blogsPage,
  createBlog,
  deleteBlog,
  updateBlog,
  getAllBlogs,
  getBlogById,
  createBlogView,
  updateBlogView,
};
