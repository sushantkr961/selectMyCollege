const FAQ = require("../model/collegeFaqModel");
const College = require("../model/collegeModel");

// Get all FAQs
const getAllCollegeFAQs = async (req, res) => {
  const { collegeId } = req.query;
  try {
    const [college, faqs] = await Promise.all([
      College.findById(collegeId),
      FAQ.find({ collegeId }),
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

const createCollegeFAQView = async (req, res) => {
  //   const { id, collegeId } = req.params;
  //   try {
  //     const [faqs, college] = await Promise.all([
  //       FAQ.findById(id),
  //       College.findById(collegeId),
  //     ]);
  //     if (!faqs || !college) {
  //       return res.status(404).send("FAQs or College not found");
  //     }
  //     res.render("", {
  //       title: "selectmycollege Admin",
  //       faqs,
  //       college,
  //     });
  //   } catch (error) {
  //     console.error(error);
  //     res.status(500).send("Internal Server Error");
  //   }
};

// Create a new FAQ
const createCollegeFAQ = async (req, res) => {
  const { collegeId } = req.query;
  const { question, answer } = req.body;
  try {
    const newFAQ = await FAQ.create({ collegeId, question, answer });
    req.session.message = {
      type: "success",
      message: "FAQ created successfully",
    };
    res.redirect(`/admin/addColleges/next/FAQs?collegeId=${collegeId}`);
  } catch (error) {
    console.error("Failed to create FAQ:", error);
    req.session.message = { type: "danger", message: "Failed to create FAQ" };
    res.redirect(`/admin/addColleges/next/FAQs?collegeId=${collegeId}`);
  }
};

const updateCollegeFAQView = async (req, res) => {
  const { id } = req.params;
  try {
    const faq = await FAQ.findById(id);

    if (!faq) {
      req.session.message = {
        type: "danger",
        message: "faq not found",
      };
      return res.redirect("/faqs");
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
    res.redirect("/faqs");
  }
};

// Update a FAQ by ID
const updateCollegeFAQ = async (req, res) => {
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
      res.redirect("/faqs");
    } else {
      req.session.message = {
        type: "success",
        message: "FAQ updated successfully",
      };
      res.redirect("/faqs");
    }
  } catch (error) {
    console.error("Failed to update FAQ:", error);
    req.session.message = { type: "danger", message: "Failed to update FAQ" };
    res.redirect("/faqs");
  }
};

// Delete a FAQ by ID
const deleteCollegeFAQ = async (req, res) => {
  const { id, collegeId } = req.params;
  try {
    const deletedFAQ = await FAQ.findByIdAndDelete(id);
    if (!deletedFAQ) {
      req.session.message = { type: "danger", message: "FAQ not found" };
      res.redirect(`/admin/addColleges/next/FAQs?collegeId=${collegeId}`);
    } else {
      req.session.message = {
        type: "success",
        message: "FAQ deleted successfully",
      };
      res.redirect(`/admin/addColleges/next/FAQs?collegeId=${collegeId}`);
    }
  } catch (error) {
    console.error("Failed to delete FAQ:", error);
    req.session.message = { type: "danger", message: "Failed to delete FAQ" };
    res.redirect(`/admin/addColleges/next/FAQs?collegeId=${collegeId}`);
  }
};

module.exports = {
  getAllCollegeFAQs,
  createCollegeFAQView,
  createCollegeFAQ,
  updateCollegeFAQView,
  updateCollegeFAQ,
  deleteCollegeFAQ,
};
