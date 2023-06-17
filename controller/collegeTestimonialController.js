const fs = require("fs");
const College = require("../model/collegeModel");
const collegeTestimonial = require("../model/collegeTestimonialModel");

const collegeTestimonialView = async (req, res) => {
  const { collegeId } = req.query;
  try {
    const [college, testimonials] = await Promise.all([
      College.findById(collegeId),
      collegeTestimonial.find({ collegeId }),
    ]);
    if (!college) {
      req.session.message = { type: "error", text: "College not found" };
    }
    res.render("admin/addClgTestimonial", {
      college,
      testimonials,
      title: "selectmycollege",
    });
  } catch (error) {
    console.error("Error retrieving testimonials:", error);
    req.session.message = {
      type: "error",
      text: "Error retrieving testimonials",
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
      return res.status(404).send("Testimonial or College not found");
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

module.exports = {
  createCollegeTestimonial,
  collegeTestimonialView,
  deleteCollegeTestimonial,
  editCollegeTestimonialView,
  editCollegeTestimonial,
};
