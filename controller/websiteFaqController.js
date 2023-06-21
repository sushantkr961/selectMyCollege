const FAQ = require("../model/websiteFaqModel");

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

module.exports = {
  getAllFAQs,
  createFAQView,
  createFAQ,
  updateFAQView,
  updateFAQ,
  deleteFAQ,
};
