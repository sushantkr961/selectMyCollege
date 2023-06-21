const FAQ = require("../model/collegeFaqModel");
const College = require("../model/collegeModel");

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
  const { id, collegeId } = req.params;
  try {
    const [faq, college] = await Promise.all([
      FAQ.findById(id),
      College.findById(collegeId),
    ]);

    if (!faq || !college) {
      req.session.message = {
        type: "danger",
        message: "FAQ or College not found",
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
    const updatedFAQ = await FAQ.findByIdAndUpdate(
      id,
      { question, answer },
      { new: true }
    );
    if (!updatedFAQ) {
      req.session.message = { type: "danger", message: "FAQ not found" };
      res.redirect(`/admin/addColleges/next/FAQs?collegeId=${collegeId}`);
    } else {
      req.session.message = {
        type: "success",
        message: "FAQ updated successfully",
      };
      res.redirect(`/admin/addColleges/next/FAQs?collegeId=${collegeId}`);
    }
  } catch (error) {
    console.error("Failed to update FAQ:", error);
    req.session.message = { type: "danger", message: "Failed to update FAQ" };
    res.redirect(`/admin/addColleges/next/FAQs?collegeId=${collegeId}`);
  }
};

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
  createCollegeFAQ,
  updateCollegeFAQView,
  updateCollegeFAQ,
  deleteCollegeFAQ,
};
