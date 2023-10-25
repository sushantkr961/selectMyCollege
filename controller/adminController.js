const fs = require("fs");
const Alumni = require("../model/alumniModel");
const Blog = require("../model/blogModel");
const College = require("../model/collegeModel");
const FAQc = require("../model/collegeFaqModel");
const collegeTestimonial = require("../model/collegeTestimonialModel");
const Lead = require("../model/leadsModel");
const Banner = require("../model/bannerModel");
const FAQ = require("../model/websiteFaqModel");
const User = require("../model/userModel");
const WebsiteTestimonial = require("../model/websiteTestimonialModel");
const Course = require("../model/courseModel");
const Fee = require("../model/feeModel");
const imageSize = require("image-size");
const State = require("../model/stateModel");
const City = require("../model/cityModel");

const viewAlunmi = async (req, res) => {
  const { collegeId } = req.query;
  try {
    const college = await College.findById(collegeId);
    if (!college) {
      req.session.message = {
        type: "danger",
        message: "College Not Found!",
      };
      res.redirect("/admin/addColleges/next/alumni");
    }
    const alumni = await Alumni.find({ collegeId });
    res.render("admin/addAlumni", {
      title: "selectmycollege",
      college,
      alumni,
    });
  } catch (err) {
    console.error(err);
    req.session.message = {
      type: "danger",
      message: "Internal Server Error",
    };
    res.redirect("/admin/addColleges/next/alumni");
  }
};

const createAlum = async (req, res) => {
  const { name, batch, package } = req.body;
  const collegeId = req.query.collegeId;
  console.log(req);
  try {
    let alum = await Alumni.create({
      name,
      batch,
      package,
      collegeId,
    });
    const alumni = await Alumni.find({ collegeId: collegeId });

    let avgPackage = 0;
    if (alumni.length > 0) {
      const totalPackage = alumni.reduce(
        (total, alum) => total + parseFloat(alum.package),
        0
      );
      avgPackage = (totalPackage / alumni.length).toFixed(2);
    }

    await Alumni.updateMany(
      { collegeId: collegeId },
      { avgPackage: avgPackage }
    );

    req.session.message = {
      type: "success",
      message: "Alum created successfully",
    };
    return res.redirect(
      `/admin/addColleges/next/alumni?collegeId=${collegeId}`
    );
  } catch (error) {
    console.error(error);
    req.session.message = {
      type: "danger",
      message: "Internal Server Error",
    };
    return res.redirect(
      `/admin/addColleges/next/alumni?collegeId=${collegeId}`
    );
  }
};

const deleteAlumni = async (req, res) => {
  const { id, collegeId } = req.params;
  try {
    await Alumni.findByIdAndDelete(id);
    return res.redirect(
      `/admin/addColleges/next/alumni?collegeId=${collegeId}`
    );
  } catch (err) {
    console.error(err);
    req.session.message = {
      type: "danger",
      message: "Internal Server Error",
    };
    return res.redirect(
      `/admin/addColleges/next/alumni?collegeId=${collegeId}`
    );
  }
};

const editAlumniView = async (req, res) => {
  const { id, collegeId } = req.params;
  try {
    const alum = await Alumni.findById(id);
    if (!alum) {
      return res.status(404).send("Alumni not found");
    }
    res.render("admin/editAlumni", {
      title: "Edit Alumni",
      alum,
      collegeId,
    });
  } catch (error) {
    console.error(error);
    req.session.message = {
      type: "danger",
      message: "Internal Server Error",
    };
    return res.redirect(
      `/admin/addColleges/next/alumni?collegeId=${collegeId}`
    );
  }
};

const editAlum = async (req, res) => {
  const { id, collegeId } = req.params;
  const { name, batch, package } = req.body;
  try {
    const alum = await Alumni.findByIdAndUpdate(
      id,
      { name, batch, package },
      { new: true }
    );
    if (!alum) {
      req.session.message = {
        type: "danger",
        message: "Alumni not found",
      };
      return res.redirect(
        `/admin/addColleges/next/alumni?collegeId=${collegeId}`
      );
    }

    // Find all alumni of the specific college
    const alumni = await Alumni.find({ collegeId: collegeId });

    // Calculate average package
    let avgPackage = 0;
    if (alumni.length > 0) {
      const totalPackage = alumni.reduce(
        (total, alum) => total + parseFloat(alum.package),
        0
      );
      avgPackage = (totalPackage / alumni.length).toFixed(2);
    }

    // Update avgPackage field for all alumni in the college
    await Alumni.updateMany(
      { collegeId: collegeId },
      { avgPackage: avgPackage }
    );

    req.session.message = {
      type: "success",
      message: "Alumni updated successfully",
    };
    return res.redirect(
      `/admin/addColleges/next/alumni?collegeId=${collegeId}`
    );
  } catch (error) {
    console.error(error);
    req.session.message = {
      type: "danger",
      message: "Internal Server Error",
    };
    return res.redirect(
      `/admin/addColleges/next/alumni?collegeId=${collegeId}`
    );
  }
};

// blog controller
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

    res.render("blog", {
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
        fs.unlinkSync("public/" + req.body.old_image);
      } catch (error) {
        console.log(error);
      }
    } else {
      new_logo = req.body.old_image;
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

// collegeFaqController
const getAllCollegeFAQs = async (req, res) => {
  const { collegeId } = req.query;
  try {
    const [college, faqs] = await Promise.all([
      College.findById(collegeId),
      FAQc.find({ collegeId }),
    ]);
    if (!college) {
      req.session.message = {
        type: "danger",
        message: "College not found",
      };
    }
    res.render("admin/addCollegeFAQs", {
      title: "selectmycollege",
      college,
      faqs,
    });
  } catch (err) {
    console.error(err);
    req.session.message = {
      type: "danger",
      message: "Internal Server Error",
    };
    res.redirect("/admin/addColleges/next/FAQs");
  }
};

const createCollegeFAQ = async (req, res) => {
  const { collegeId } = req.query;
  const { question, answer } = req.body;
  try {
    const newFAQ = await FAQc.create({ collegeId, question, answer });
    req.session.message = {
      type: "success",
      message: "FAQc created successfully",
    };
    res.redirect(`/admin/addColleges/next/FAQs?collegeId=${collegeId}`);
  } catch (error) {
    console.error("Failed to create FAQc:", error);
    req.session.message = { type: "danger", message: "Failed to create FAQc" };
    res.redirect(`/admin/addColleges/next/FAQs?collegeId=${collegeId}`);
  }
};

const updateCollegeFAQView = async (req, res) => {
  const { id, collegeId } = req.params;
  try {
    const [faq, college] = await Promise.all([
      FAQc.findById(id),
      College.findById(collegeId),
    ]);

    if (!faq || !college) {
      req.session.message = {
        type: "danger",
        message: "FAQc or College not found",
      };
      return res.redirect(
        `/admin/addColleges/next/FAQs?collegeId=${collegeId}`
      );
    }
    res.render("admin/editCollegeFAQs", {
      title: "Edit faq",
      faq,
      college,
    });
  } catch (error) {
    console.error(error);
    req.session.message = {
      type: "danger",
      message: "Internal Server Error",
    };
    res.redirect(`/admin/addColleges/next/FAQs?collegeId=${collegeId}`);
  }
};

const updateCollegeFAQ = async (req, res) => {
  const { id, collegeId } = req.params;
  const { question, answer } = req.body;
  try {
    const updatedFAQ = await FAQc.findByIdAndUpdate(
      id,
      { question, answer },
      { new: true }
    );
    if (!updatedFAQ) {
      req.session.message = { type: "danger", message: "FAQc not found" };
      res.redirect(`/admin/addColleges/next/FAQs?collegeId=${collegeId}`);
    } else {
      req.session.message = {
        type: "success",
        message: "FAQc updated successfully",
      };
      res.redirect(`/admin/addColleges/next/FAQs?collegeId=${collegeId}`);
    }
  } catch (error) {
    console.error("Failed to update FAQc:", error);
    req.session.message = { type: "danger", message: "Failed to update FAQc" };
    res.redirect(`/admin/addColleges/next/FAQs?collegeId=${collegeId}`);
  }
};

const deleteCollegeFAQ = async (req, res) => {
  const { id, collegeId } = req.params;
  try {
    const deletedFAQ = await FAQc.findByIdAndDelete(id);
    if (!deletedFAQ) {
      req.session.message = { type: "danger", message: "FAQc not found" };
      res.redirect(`/admin/addColleges/next/FAQs?collegeId=${collegeId}`);
    } else {
      req.session.message = {
        type: "success",
        message: "FAQc deleted successfully",
      };
      res.redirect(`/admin/addColleges/next/FAQs?collegeId=${collegeId}`);
    }
  } catch (error) {
    console.error("Failed to delete FAQc:", error);
    req.session.message = { type: "danger", message: "Failed to delete FAQc" };
    res.redirect(`/admin/addColleges/next/FAQs?collegeId=${collegeId}`);
  }
};

const adminRoute = async (req, res) => {
  res.redirect("admin/dashboard");
};

const adminPage = async (req, res) => {
  try {
    const collegeCount = await College.countDocuments();
    const courseCount = await Course.countDocuments();
    const alumniCount = await Alumni.countDocuments();
    const leadsCount = await Lead.countDocuments();

    res.render("admin/dashboard", {
      title: "selectmycollege Admin",
      collegeCount,
      courseCount,
      alumniCount,
      leadsCount,
    });
  } catch (error) {
    console.error("Error getting count:", error);
    req.session.message = {
      type: "warning",
      message: "Error getting count",
    };
    return res.redirect("/admin/dashboard");
  }
};

const createCollegeView = async (req, res) => {
  try {
    const citiesPromise = City.find();
    const statesPromise = State.find();
    const [cities, states] = await Promise.all([citiesPromise, statesPromise]);

    res.render("admin/addCollege", {
      title: "selectmycollege Admin",
      cities,
      states,
    });
  } catch (error) {
    console.error("Error retrieving cities:", error);
    req.session.message = {
      type: "danger",
      message: "Error retrieving cities.",
    };
    return res.redirect("/admin/addCollege");
  }
};

const createCollege = async (req, res) => {
  try {
    const {
      name,
      address,
      state,
      pinCode,
      city,
      facilities,
      shortName,
      images,
      description,
    } = req.body;

    if (!(name && address && pinCode)) {
      req.session.message = {
        type: "danger",
        message: "All inputs are required",
      };
      return res.redirect("/admin/addColleges");
    }

    const collegeExists = await College.findOne({ name });
    if (collegeExists) {
      req.session.message = {
        type: "warning",
        message: "College already exists",
      };
      return res.redirect("/admin/addColleges");
    }

    let selectedCity;
    if (Array.isArray(city)) {
      // Take the first city name from the array
      const cityName = city[0];
      selectedCity = await City.findOne({ cityName });
      if (!selectedCity) {
        selectedCity = await City.create({ cityName });
      }
    } else {
      selectedCity = await City.findOne({ cityName: city });
      if (!selectedCity) {
        selectedCity = await City.create({ cityName: city });
      }
    }

    let selectedState;
    if (Array.isArray(state)) {
      // Take the first state name from the array
      const stateName = state[0];
      selectedState = await State.findOne({ stateName });
      if (!selectedState) {
        selectedState = await State.create({ stateName: state });
      }
    } else {
      selectedState = await State.findOne({ stateName: state });
      if (!selectedState) {
        selectedState = await State.create({ stateName: state });
      }
    }

    const college = await College.create({
      name,
      address,
      state: selectedState._id,
      pinCode,
      city: selectedCity._id,
      facilities,
      shortName,
      clgLogo: "uploads/" + req.file.filename,
      images,
      description,
    });

    req.session.message = {
      type: "success",
      message: "College created successfully",
    };
    return res.redirect(`/admin/addColleges/next?collegeId=${college._id}`);
  } catch (error) {
    console.error("Error creating college:", error);
    req.session.message = {
      type: "danger",
      message: "Error creating college.",
    };
    return res.redirect("/admin/addColleges");
  }
};

const createImageGalleryView = async (req, res) => {
  const { collegeId } = req.query;
  try {
    const college = await College.findById(collegeId);
    if (!college) {
      return res.status(404).send("College not found");
    }
    const galleryImages = await Gallery.find({ collegeId });
    const bannersTrue = galleryImages.filter((image) => image.banners === true);
    const bannersFalse = galleryImages.filter(
      (image) => image.banners === false
    );
    res.render("admin/addImageGallery", {
      college,
      bannersTrue,
      bannersFalse,
    });
  } catch (err) {
    console.error(err);
    req.session.message = {
      type: "danger",
      message: "Internal Server Error",
    };
    return res.redirect("admin/addImageGallery");
  }
};

const createImageGallery = async (req, res) => {
  const files = req.files;
  const { collegeId } = req.query;
  const { banners } = req.body;
  try {
    const college = await College.findById(collegeId);
    if (!college) {
      return res.status(404).send("College not found");
    }
    // Perform validation only if the checkbox is checked
    if (banners === "true") {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const dimensions = imageSize(file.path);

        // Check if the aspect ratio is 3:2
        const targetRatio = 1.5; // 3:2 ratio
        const actualRatio = dimensions.width / dimensions.height;
        console.log(`Image ${i} aspect ratio:`, actualRatio.toFixed(2)); // Debugging print statement

        if (actualRatio.toFixed(2) != targetRatio.toFixed(2)) {
          // Delete the uploaded file
          files.forEach((file) => fs.unlinkSync(file.path));
          req.session.message = {
            type: "danger",
            message:
              "Invalid image ratio. Please select an image with a ratio of 3:2.",
          };
          return res.redirect(
            `/admin/addColleges/next/gallery?collegeId=${collegeId}`
          );
        }

        // Example validation: Check if file size is greater than 2MB
        const maxSize = 2 * 1024 * 1024; // 2MB in bytes
        if (file.size > maxSize) {
          // Delete the uploaded file
          fs.unlinkSync(file.path);
          req.session.message = {
            type: "danger",
            message:
              "Invalid file size. Please select an image with a maximum size of 2MB.",
          };
          return res.redirect(
            `/admin/addColleges/next/gallery?collegeId=${collegeId}`
          );
        }
      }
    }
    const galleryImages = files.map((file) => ({
      image: "uploads/" + file.filename,
      collegeId: collegeId,
      banners: banners === "true",
    }));
    const createdImages = await Gallery.create(galleryImages);
    college.images = college.images || [];
    college.images = college.images.concat(
      createdImages.map((image) => image._id)
    );
    await college.save();
    res.redirect(`/admin/addColleges/next/gallery?collegeId=${collegeId}`);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};

const deleteImage = async (req, res) => {
  const { collegeId, imageId } = req.params;
  try {
    const deletedImage = await Gallery.findOneAndRemove({ _id: imageId });
    if (!deletedImage) {
      req.session.message = {
        type: "danger",
        message: "Image not found",
      };
      return res.redirect(
        `/admin/addColleges/next/gallery?collegeId=${collegeId}`
      );
    }
    fs.unlinkSync("public/" + deletedImage.image);
    res.redirect(`/admin/addColleges/next/gallery?collegeId=${collegeId}`);
  } catch (err) {
    console.error(err);
    req.session.message = {
      type: "danger",
      message: "Internal Server Error",
    };
    res.redirect(`/admin/addColleges/next/gallery?collegeId=${collegeId}`);
  }
};

const getAllCollegesAdmin = async (req, res) => {
  try {
    const colleges = await College.find().populate("city state");
    res.render("admin/allColleges", {
      colleges,
      title: "allColleges",
    });
  } catch (error) {
    console.error("Error getting colleges:", error);
    req.session.message = {
      type: "danger",
      message: "Error getting colleges",
    };
    return res.redirect("/admin/allColleges");
  }
};

/** UPDATE COLLEGES STARTS HERE */
const updateCollegeView = async (req, res) => {
  try {
    const college = await College.findById(req.params.id).populate(
      "city state"
    );
    const cities = await City.find();
    const states = await State.find();

    if (!college) {
      return res.status(404).json({ error: "College not found" });
    }
    res.render("admin/editCollege", {
      title: "Update College",
      college,
      cities,
      states,
    });
  } catch (error) {
    console.error("Error getting college:", error);
    res.status(500).json({ error: "Error getting college" });
  }
};

// Controller for updating a college
const updateCollege = async (req, res) => {
  try {
    const {
      name,
      address,
      state,
      pinCode,
      city,
      url,
      description,
      facilities,
      shortName,
      clgLogo,
    } = req.body;

    const college = await College.findById(req.params.id);
    let new_logo = "";
    if (!college) {
      req.session.message = {
        type: "danger",
        message: "College not found",
      };
      return res.status(404).json({ error: "" });
    }
    if (req.file) {
      new_logo = "uploads/" + req.file.filename;
      try {
        fs.unlinkSync("public/" + req.body.old_clgLogo);
      } catch (error) {
        console.error(error);
      }
    } else {
      new_logo = req.body.old_clgLogo;
    }

    let selectedCity;
    if (Array.isArray(city)) {
      const cityName = city[0];
      selectedCity = await City.findOne({ cityName });
      if (!selectedCity) {
        selectedCity = await City.create({ cityName });
      }
    } else {
      selectedCity = await City.findOne({ cityName: city });
      if (!selectedCity) {
        selectedCity = await City.create({ cityName: city });
      }
    }

    let selectedState;
    if (Array.isArray(state)) {
      // Take the first state name from the array
      const stateName = state[0];
      selectedState = await State.findOne({ stateName });
      if (!selectedState) {
        selectedState = await State.create({ stateName: state });
      }
    } else {
      selectedState = await State.findOne({ stateName: state });
      if (!selectedState) {
        selectedState = await State.create({ stateName: state });
      }
    }

    college.name = name;
    college.address = address;
    college.state = selectedState._id;
    college.city = selectedCity._id;
    college.url = url;
    college.facilities = facilities;
    college.pinCode = pinCode;
    college.description = description;
    college.clgLogo = new_logo;
    college.shortName = shortName;
    // college.images = images;

    await college.save();

    req.session.message = {
      type: "success",
      message: "College updated successfully!",
    };
    res.redirect("/admin/allColleges");
    // res.status(200).json({ message: "College updated successfully", college });
  } catch (error) {
    console.error("Error updating college:", error);
    res.status(500).json({ error: "Error updating college" });
  }
};

/** UPDATE COLLEGES ENDS HERE */

/** DELETE COLLEGE START HERE */
const deleteCollege = async (req, res) => {
  try {
    const { id } = req.params;
    // Find the college by ID
    const college = await College.findOneAndRemove({ _id: id });
    // console.log(college);
    if (!college) {
      return res.status(404).json({ error: "College not found" });
    }
    // Delete the corresponding images from the uploads folder
    if (college.clgLogo) {
      const imagePath = "public/" + college.clgLogo;
      // console.log("Image path:", imagePath);
      fs.unlinkSync(imagePath);
    }
    req.session.message = {
      type: "success",
      message: "College Deleted Successfully!",
    };
    res.redirect("/admin/allColleges");
  } catch (error) {
    console.error("Error deleting college:", error);
    req.session.message = {
      type: "danger",
      message: "Error deleting college",
    };
    res.redirect("/admin/allColleges");
    // res.status(500).json({ error: "Error deleting college" });
  }
};
/** DELETE COLLEGE ENDS HERE */

const collegeTestimonialView = async (req, res) => {
  const { collegeId } = req.query;
  try {
    const [college, testimonials] = await Promise.all([
      College.findById(collegeId),
      collegeTestimonial.find({ collegeId }),
    ]);
    if (!college) {
      req.session.message = { type: "danger", message: "College not found" };
    }
    res.render("admin/addClgTestimonial", {
      college,
      testimonials,
      title: "selectmycollege",
    });
  } catch (error) {
    console.error("Error retrieving testimonials:", error);
    req.session.message = {
      type: "danger",
      message: "Error retrieving testimonials",
    };
    res.render("admin/addClgTestimonial", {
      error: "Error retrieving testimonials",
      title: "selectmycollege",
    });
  }
};

const createCollegeTestimonial = async (req, res) => {
  const { collegeId } = req.query;
  const { name, designation, message } = req.body;
  try {
    const testimonial = await collegeTestimonial.create({
      collegeId,
      name,
      designation,
      message,
      profileImage: "uploads/" + req.file.filename,
    });
    req.session.message = {
      type: "success",
      message: "Testimonial created successfully",
    };
    res.redirect(`/admin/addColleges/next/testimonial?collegeId=${collegeId}`);
  } catch (error) {
    console.error("Error creating testimonial:", error);
    req.session.message = {
      type: "danger",
      message: "Error creating testimonial",
    };
    res.redirect(`/admin/addColleges/next/testimonial?collegeId=${collegeId}`);
  }
};

const deleteCollegeTestimonial = async (req, res) => {
  const { id, collegeId } = req.params;
  try {
    await collegeTestimonial.findByIdAndDelete(id);
    req.session.message = {
      type: "success",
      message: "Testimonial deleted successfully",
    };
    return res.redirect(
      `/admin/addColleges/next/testimonial?collegeId=${collegeId}`
    );
  } catch (error) {
    console.error(error);
    req.session.message = {
      type: "danger",
      message: "Internal Server Error",
    };
    return res.redirect(
      `/admin/addColleges/next/testimonial?collegeId=${collegeId}`
    );
  }
};

const editCollegeTestimonialView = async (req, res) => {
  const { id, collegeId } = req.params;
  try {
    const [testimonial, college] = await Promise.all([
      collegeTestimonial.findById(id),
      College.findById(collegeId),
    ]);
    if (!testimonial || !college) {
      req.session.message = {
        type: "danger",
        message: "Testimonial or College not found",
      };
      return res.redirect(
        `/admin/addColleges/next/testimonial?collegeId=${collegeId}`
      );
    }
    res.render("admin/editClgTestimonial", {
      title: "Edit Testimonial",
      testimonial,
      college,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

const editCollegeTestimonial = async (req, res) => {
  const { id, collegeId } = req.params;
  const { name, designation, message } = req.body;
  try {
    const oldTestimonial = await collegeTestimonial.findById(id);
    let new_logo = "";
    if (!oldTestimonial) {
      req.session.message = {
        type: "danger",
        message: "Testimonial not found",
      };
      return res.redirect(
        `/admin/addColleges/next/testimonial?collegeId=${collegeId}`
      );
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
    const testimonial = await collegeTestimonial.findByIdAndUpdate(
      id,
      { name, designation, message, profileImage: new_logo },
      { new: true }
    );
    req.session.message = {
      type: "success",
      message: "Testimonial updated successfully",
    };
    return res.redirect(
      `/admin/addColleges/next/testimonial?collegeId=${collegeId}`
    );
  } catch (error) {
    console.error(error);
    req.session.message = {
      type: "danger",
      message: "Internal Server Error",
    };
    return res.redirect(
      `/admin/addColleges/next/testimonial?collegeId=${collegeId}`
    );
  }
};

const leadsPage = async (req, res) => {
  try {
    const leads = await Lead.find();
    res.render("admin/leads", { title: "selectmycollege All Colleges", leads });
  } catch (error) {
    console.error("Error retrieving leads:", error);
    req.session.message = {
      type: "error",
      text: "Error retrieving leads",
    };
    res.render("admin/leads", { title: "selectmycollege All Colleges" });
  }
};

const uploadBannerImage = async (req, res) => {
  const files = req.files;
  try {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      // const dimensions = imageSize(file.path);
      // const targetWidth = 1920;
      // const targetHeight = 1080;
      // if (dimensions.width < targetWidth || dimensions.height < targetHeight) {
      //   fs.unlinkSync(file.path);
      //   req.session.message = {
      //     type: "danger",
      //     message:
      //       "Invalid image resolution. Please select an image with a minimum resolution of 1920x1080.",
      //   };
      //   return res.redirect(`/admin/banner`);
      // }

      const maxSize = 4 * 1024 * 1024;
      if (file.size > maxSize) {
        fs.unlinkSync(file.path);
        req.session.message = {
          type: "danger",
          message:
            "Invalid file size. Please select an image with a maximum size of 4MB.",
        };
        return res.redirect(`/admin/banner`);
      }
    }

    const galleryImages = files.map((file) => ({
      image: "uploads/" + file.filename,
    }));

    const createdImages = await Banner.create(galleryImages);
    res.redirect(`/admin/banner`);
  } catch (err) {
    console.error(err);
    req.session.message = {
      type: "danger",
      message: "Internal Server Error",
    };
    return res.redirect("/admin/banner");
  }
};

const UploadBannerView = async (req, res) => {
  try {
    const banners = await Banner.find();
    res.render("admin/addWebsiteBanner", {
      title: "selectmycollege",
      banners,
    });
  } catch (err) {
    console.error(err);
    req.session.message = {
      type: "danger",
      message: "Internal Server Error",
    };
    return res.redirect("/admin/banner");
  }
};

const deleteGalleryImage = async (req, res) => {
  const imageId = req.params.id;
  try {
    const galleryImage = await Banner.findById(imageId);
    if (!galleryImage) {
      req.session.message = {
        type: "danger",
        message: "Gallery image not found",
      };
      return res.redirect("/admin/banner");
    }
    await Banner.deleteOne({ _id: imageId });

    req.session.message = {
      type: "success",
      message: "Gallery image deleted successfully",
    };
    return res.redirect("/admin/banner");
  } catch (error) {
    console.error("Error deleting gallery image:", error);
    req.session.message = {
      type: "danger",
      message: "Error deleting gallery image",
    };
    return res.redirect("/admin/banner");
  }
};

// Get all FAQs
const getAllFAQs = async (req, res) => {
  try {
    const faqs = await FAQ.find();
    res.status(200).render("admin/allWebFAQs", {
      title: "FAQs",
      faqs,
      message: req.session.message,
    });
    req.session.message = null;
  } catch (error) {
    console.error("Failed to fetch FAQs:", error);
    req.session.message = { type: "danger", message: "Failed to fetch FAQs" };
    res.redirect("/admin/allFaqs");
  }
};

const createFAQView = async (req, res) => {
  res.render("admin/addWebsiteFAQs", {
    title: "selectmycollege Admin",
  });
};

// Create a new FAQ
const createFAQ = async (req, res) => {
  try {
    const { question, answer } = req.body;
    const newFAQ = await FAQ.create({ question, answer });
    req.session.message = {
      type: "success",
      message: "FAQ created successfully",
    };
    res.redirect("/admin/allFaqs");
  } catch (error) {
    console.error("Failed to create FAQ:", error);
    req.session.message = { type: "danger", message: "Failed to create FAQ" };
    res.redirect("/admin/allFaqs");
  }
};

const updateFAQView = async (req, res) => {
  const { id } = req.params;
  try {
    const faq = await FAQ.findById(id);

    if (!faq) {
      req.session.message = {
        type: "danger",
        message: "faq not found",
      };
      return res.redirect("/admin/allFaqs");
    }
    res.render("admin/editWebFAQs", {
      title: "Edit faq",
      faq,
    });
  } catch (error) {
    console.error(error);
    req.session.message = {
      type: "danger",
      message: "Internal Server Error",
    };
    res.redirect("/admin/allFaqs");
  }
};

// Update a FAQ by ID
const updateFAQ = async (req, res) => {
  const { id } = req.params;
  const { question, answer } = req.body;
  try {
    const updatedFAQ = await FAQ.findByIdAndUpdate(
      id,
      { question, answer },
      { new: true }
    );
    if (!updatedFAQ) {
      req.session.message = { type: "danger", message: "FAQ not found" };
      res.redirect("/admin/allFaqs");
    } else {
      req.session.message = {
        type: "success",
        message: "FAQ updated successfully",
      };
      res.redirect("/admin/allFaqs");
    }
  } catch (error) {
    console.error("Failed to update FAQ:", error);
    req.session.message = { type: "danger", message: "Failed to update FAQ" };
    res.redirect("/admin/allFaqs");
  }
};

// Delete a FAQ by ID
const deleteFAQ = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedFAQ = await FAQ.findByIdAndDelete(id);
    if (!deletedFAQ) {
      req.session.message = { type: "danger", message: "FAQ not found" };
      res.redirect("/admin/allFaqs");
    } else {
      req.session.message = {
        type: "success",
        message: "FAQ deleted successfully",
      };
      res.redirect("/admin/allFaqs");
    }
  } catch (error) {
    console.error("Failed to delete FAQ:", error);
    req.session.message = { type: "danger", message: "Failed to delete FAQ" };
    res.redirect("/admin/allFaqs");
  }
};

const deleteAdmin = async (req, res) => {
  const { id } = req.params;
  try {
    await User.findByIdAndDelete(id);
    req.session.message = {
      type: "success",
      message: "User deleted successfully",
    };
    res.redirect("/admin/allAdmin");
  } catch (error) {
    req.session.message = {
      type: "danger",
      message: "Failed to delete user",
    };
    res.redirect("/admin/allAdmin");
  }
};

const registerView = async (req, res) => {
  res.render("admin/addAdmin", { title: "selectMyCollege" });
};

const register = async (req, res) => {
  const { username, password, adminRole } = req.body;
  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      req.session.message = {
        type: "danger",
        message: "Username already exists",
      };
      return res.redirect("/admin/register");
    }
    let role = "user";
    if (adminRole) {
      role = "admin";
    }
    const newUser = new User({
      username,
      password,
      role,
    });
    await newUser.save();

    req.session.message = {
      type: "success",
      message: "Admin Created successfully",
    };
    res.redirect("/admin/allAdmin");
  } catch (error) {
    req.session.message = {
      type: "danger",
      message: "Registration failed",
    };
    res.redirect("/admin/register");
  }
};

const allAdmin = async (req, res) => {
  try {
    const users = await User.find();
    res.render("admin/allAdmin", {
      users,
      title: "selectMyCollege",
      message: req.session.message,
    });
    req.session.message = null;
  } catch (error) {
    req.session.message = {
      type: "danger",
      message: "Failed to fetch users",
    };
    res.redirect("/login");
  }
};
const loginView = async (req, res) => {
  res.render("login", { title: "selectMyCollege" });
};

const login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      req.session.message = {
        type: "danger",
        message: "Invalid username or password",
      };
      return res.redirect("/login");
    }
    if (user.password !== password) {
      req.session.message = {
        type: "danger",
        message: "Invalid username or password",
      };
      return res.redirect("/login");
    }
    req.session.isAuthenticated = true;
    req.session.user = {
      id: user._id,
      username: user.username,
      role: user.role,
    };
    res.redirect("/admin/dashboard");
  } catch (error) {
    req.session.message = {
      type: "danger",
      message: "Login failed",
    };
    res.redirect("/login");
  }
};

const logout = (req, res) => {
  req.session.destroy();
  res.redirect("/");
};

const createWebsiteTestimonialView = async (req, res) => {
  res.render("admin/addWebTestimonial", {
    title: "selectmycollege Admin",
  });
};

const createWebsiteTestimonial = async (req, res) => {
  try {
    const { name, designation, message } = req.body;
    const newTestimonial = await WebsiteTestimonial.create({
      name,
      designation,
      message,
      profileImage: "uploads/" + req.file.filename,
    });
    req.session.message = {
      type: "success",
      message: "Testimonial created successfully",
    };
    res.redirect(`/testimonials`);
  } catch (error) {
    console.error("Failed to create testimonial:", error);
    req.session.message = {
      type: "danger",
      message: "Error creating testimonial",
    };
    res.redirect("/testimonials");
  }
};

const deleteWebsiteTestimonial = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedTestimonial = await WebsiteTestimonial.findByIdAndDelete(id);
    if (!deletedTestimonial) {
      req.session.message = {
        type: "danger",
        message: "Testimonial not found",
      };
      res.redirect("/testimonials");
    } else {
      req.session.message = {
        type: "success",
        message: "Testimonial deleted successfully",
      };
      res.redirect("/testimonials");
    }
  } catch (error) {
    console.error("Failed to delete testimonial:", error);
    req.session.message = {
      type: "danger",
      message: "Failed to delete testimonial",
    };
    res.redirect("/testimonials");
  }
};

const editWebsiteTestimonialView = async (req, res) => {
  const { id } = req.params;
  try {
    const testimonial = await WebsiteTestimonial.findById(id);

    if (!testimonial) {
      req.session.message = {
        type: "danger",
        message: "Testimonial not found",
      };
      return res.redirect("/testimonials");
    }
    res.render("admin/editWebTestimonial", {
      title: "Edit Testimonial",
      testimonial,
    });
  } catch (error) {
    console.error(error);
    req.session.message = {
      type: "danger",
      message: "Internal Server Error",
    };
    res.redirect("/testimonials");
  }
};

const editWebsiteTestimonial = async (req, res) => {
  const { id } = req.params;
  const { name, designation, message } = req.body;
  let profileImage = req.body.profileImage;

  try {
    const oldTestimonial = await WebsiteTestimonial.findById(id);

    if (!oldTestimonial) {
      req.session.message = {
        type: "danger",
        message: "Testimonial not found",
      };
      return res.redirect("/admin/testimonial");
    }

    if (req.file) {
      // Delete the previous profile image
      if (oldTestimonial.profileImage) {
        fs.unlinkSync("public/" + oldTestimonial.profileImage);
      }

      profileImage = "uploads/" + req.file.filename;
    }

    const updatedTestimonial = await WebsiteTestimonial.findByIdAndUpdate(
      id,
      { name, designation, message, profileImage },
      { new: true }
    );

    if (!updatedTestimonial) {
      req.session.message = {
        type: "danger",
        message: "Failed to update testimonial",
      };
    } else {
      req.session.message = {
        type: "success",
        message: "Testimonial updated successfully",
      };
    }

    res.redirect("/testimonials");
  } catch (error) {
    console.error("Failed to update testimonial:", error);
    req.session.message = {
      type: "danger",
      message: "Failed to update testimonial",
    };
    res.redirect("/testimonials");
  }
};

const createCourse = async (req, res) => {
  const {
    courseSelect,
    subCourseSelect,
    addCourse,
    addSubCourse,
    duration,
    fee,
    eligibility,
  } = req.body;
  const collegeId = req.query.collegeId;
  // console.log(req.body);
  try {
    let courseId;
    if (courseSelect === "Other") {
      if (subCourseSelect === "Other") {
        const course = await Course.create({
          name: addCourse,
        });
        let mcourseId = course._id;
        const subcourse = await Course.create({
          name: addSubCourse,
          duration,
          eligibility,
          percouid: mcourseId,
        });
        courseId = subcourse._id;
      } else {
        const course = await Course.create({
          name: addCourse,
          duration,
          eligibility,
        });
        courseId = course._id;
      }
    } else {
      if (subCourseSelect === "Other") {
        const course = await Course.create({
          name: addSubCourse,
          duration,
          eligibility,
          percouid: courseSelect,
        });
        courseId = course._id;
      } else if (subCourseSelect === "No Sub Course") {
        courseId = courseSelect;
      } else {
        courseId = subCourseSelect;
      }
    }
    let totalFee = 0;
    fee.map((feeSum) => {
      totalFee += Number(feeSum[1]); // Convert string to number before adding
    });

    await Fee.create({
      collegeId,
      courseId,
      fees: fee,
      totalFee: totalFee, // Save the total fee
    });

    return res.redirect(`/admin/addColleges/next?collegeId=${collegeId}`);
  } catch (error) {
    // console.error("Error creating college:", error);
    // res.status(500).json({ error: "Error creating college" });
    return res.redirect(`/admin/addColleges/next?collegeId=${collegeId}`);
  }
};

const deleteCourseTwo = async (req, res) => {
  const collegeId = req.params.id;
  const feeId = req.params.feeId;
  try {
    // Delete the fee based on the feeId
    await Fee.findByIdAndRemove(feeId);
    return res.redirect(`/admin/addColleges/next?collegeId=${collegeId}`);
  } catch (error) {
    console.error("Error deleting course:", error);
    res.status(500).json({ error: "Error deleting course" });
  }
};

const editCollegeCourseView = async (req, res) => {
  try {
    const feeId = req.params.feeid;
    const fee = await Fee.findById(feeId);
    const college = await College.findById(fee.collegeId);
    const course = await Course.findById(fee.courseId);

    res.render("admin/editCollegeCourseView", {
      title: "selectmycollege",
      fee,
      college,
      course,
    });
  } catch (error) {}
};

const editCollegeCourse = async (req, res) => {
  try {
    const feeId = req.params.feeid;
    const { fee } = req.body;

    const updatedFee = await Fee.findById(feeId);

    if (!updatedFee) {
      req.session.message = "Fee not found";
      return res.redirect(
        `/admin/addColleges/next?collegeId=${updatedFee.collegeId}`
      );
    }

    updatedFee.fees = fee;
    await updatedFee.save();

    req.session.message = "Fee updated successfully";
    return res.redirect(
      `/admin/addColleges/next?collegeId=${updatedFee.collegeId}`
    );
  } catch (error) {
    console.error("Error updating college course:", error);
    req.session.message = "Error updating college course";
    return res.redirect("/allColleges");
  }
};

const allCoursesView = async (req, res) => {
  try {
    const mainCourses = await Course.find({ percouid: 0 });
    const subCourses = await Course.find({ percouid: { $ne: 0 } });
    const courses = mainCourses.map((course) => {
      const relatedSubCourses = subCourses.filter(
        (subCourse) => subCourse.percouid.toString() === course._id.toString()
      );
      return {
        ...course._doc,
        subCourses: relatedSubCourses,
      };
    });

    res.render("admin/allCourses", { courses, title: "selectMyCollege" });
  } catch (error) {
    console.error("Error retrieving courses:", error);
    res.status(500).send("Internal Server Error");
  }
};

const deleteCourse = async (req, res) => {
  try {
    const courseId = req.params.id;
    if (!courseId) {
      req.session.message = { type: "danger", message: "CourseId is required" };
      return res.redirect("/allCourses");
    }
    const deletedCourse = await Course.findByIdAndDelete(courseId);
    if (!deletedCourse) {
      req.session.message = { type: "danger", message: "Course not found" };
      return res.redirect("/allCourses");
    }
    req.session.message = {
      type: "success",
      message: "Course deleted successfully",
    };
    res.redirect("/allCourses");
  } catch (error) {
    console.error("Error deleting course:", error);
    req.session.message = { type: "danger", message: "Internal Server Error" };
    res.redirect("/allCourses");
  }
};

const updateCourseView = async (req, res) => {
  try {
    const courseId = req.params.id;
    const course = await Course.findById(courseId);
    if (!course) {
      // return res.status(404).json({ message: "Course not found" });
      req.session.message = {
        type: "danger",
        message: "Course not found",
      };
      res.redirect(`/allCourses`);
    }

    const subCourses = await Course.find({ percouid: courseId });

    res.render("admin/editCourses", {
      title: "Update Course",
      course,
      subCourses,
    });
  } catch (error) {
    console.error("Error retrieving course:", error);
    res.redirect(`/allCourses`);
  }
};

const updateCourse = async (req, res) => {
  try {
    const courseId = req.params.id;
    const updatedCourseData = req.body;
    const updatedCourse = await Course.findByIdAndUpdate(
      courseId,
      updatedCourseData,
      { new: true }
    );
    if (!updatedCourse) {
      req.session.message = { type: "danger", message: "Course not found" };
      return res.redirect("/admin/allCourses");
    }
    req.session.message = {
      type: "success",
      message: "Course updated successfully",
    };
    res.redirect("/admin/allCourses");
  } catch (error) {
    console.error("Error updating course:", error);
    req.session.message = { type: "danger", message: "Internal Server Error" };
    res.redirect("/admin/allCourses");
  }
};

const createCourseView = async (req, res) => {
  try {
    const { collegeId } = req.query;
    const college = await College.findById(collegeId);
    const courses = await Course.find({ percouid: 0 });
    const subCourses = await Course.find({ percouid: { $ne: 0 } }); // Find subcourses
    const fee = await Fee.find({ collegeId });
    res.render("admin/addCollegeTwo", {
      college,
      courses,
      subCourses,
      fee,
      title: "next",
    });
  } catch (error) {
    console.error("Error retrieving college, courses, and fees:", error);
    req.session.message = {
      type: "danger",
      message: "Server Error! Please try again later.",
    };
    return res.redirect("/allColleges");
  }
};

module.exports = {
  updateCollegeView,
  updateCollege,
  getAllCollegesAdmin,
  deleteImage,
  createCollege,
  createImageGallery,
  createImageGalleryView,
  viewAlunmi,
  createAlum,
  deleteAlumni,
  editAlumniView,
  editAlum,
  blogsPage,
  createBlog,
  deleteBlog,
  updateBlog,
  getAllBlogs,
  createBlogView,
  updateBlogView,
  getAllCollegeFAQs,
  createCollegeFAQ,
  updateCollegeFAQView,
  updateCollegeFAQ,
  deleteCollegeFAQ,
  adminRoute,
  adminPage,
  createCollegeView,
  deleteCollege,
  createCollegeTestimonial,
  collegeTestimonialView,
  deleteCollegeTestimonial,
  editCollegeTestimonialView,
  editCollegeTestimonial,
  uploadBannerImage,
  UploadBannerView,
  deleteGalleryImage,
  getAllFAQs,
  createFAQView,
  createFAQ,
  updateFAQView,
  updateFAQ,
  deleteFAQ,
  register,
  login,
  logout,
  loginView,
  registerView,
  allAdmin,
  deleteAdmin,
  createWebsiteTestimonial,
  createWebsiteTestimonialView,
  deleteWebsiteTestimonial,
  editWebsiteTestimonial,
  editWebsiteTestimonialView,
  createCourse,
  createCourseView,
  editCollegeCourseView,
  deleteCourseTwo,
  editCollegeCourse,
  allCoursesView,
  deleteCourse,
  updateCourse,
  updateCourseView,
  leadsPage,
};
