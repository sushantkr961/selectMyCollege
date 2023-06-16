const fs = require("fs");
const WebsiteTestimonial = require("../model/websiteTestimonialModel");

const getAllWebTestimonials = async (req, res) => {
  try {
    const testimonials = await WebsiteTestimonial.find();
    res.render("admin/allWebTestimonial", {
      title: "selectmycollege",
      testimonials,
    });
  } catch (error) {
    console.error("Failed to fetch testimonials:", error);
    req.session.message = {
      type: "danger",
      message: "Failed to fetch testimonials",
    };
    res.redirect("/testimonials");
  }
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
      return res.status(404).send("Testimonial not found");
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

module.exports = {
  createWebsiteTestimonial,
  createWebsiteTestimonialView,
  deleteWebsiteTestimonial,
  editWebsiteTestimonial,
  editWebsiteTestimonialView,
  getAllWebTestimonials,
};
