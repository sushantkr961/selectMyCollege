const Alumni = require("../model/alumniModel");
const College = require("../model/collegeModel");

const viewAlunmi = async (req, res) => {
  const { collegeId } = req.query;
  try {
    const college = await College.findById(collegeId);
    if (!college) {
      return res.status(404).send("College not found");
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
  try {
    const alum = await Alumni.create({
      name,
      batch,
      package,
      collegeId,
    });
    req.session.message = {
      type: "success",
      message: "Alum created successfully",
    };
    return res.redirect(`/admin/addColleges/next/alumni?collegeId=${collegeId}`);
  } catch (error) {
    console.error(error);
    req.session.message = {
      type: "danger",
      message: "Internal Server Error",
    };
    return res.redirect(`/admin/addColleges/next/alumni?collegeId=${collegeId}`);
  }
};

const deleteAlumni = async (req, res) => {
  const { id, collegeId } = req.params;
  try {
    await Alumni.findByIdAndDelete(id);
    return res.redirect(`/admin/addColleges/next/alumni?collegeId=${collegeId}`);
  } catch (err) {
    console.error(err);
    req.session.message = {
      type: "danger",
      message: "Internal Server Error",
    };
    return res.redirect(`/admin/addColleges/next/alumni?collegeId=${collegeId}`);
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
    return res.redirect(`/admin/addColleges/next/alumni?collegeId=${collegeId}`);
  }
};

const editAlum = async (req, res) => {
  const { id, collegeId } = req.params;
  const { name, batch, package } = req.body;
  console.log(req.params);
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
      return res.redirect(`/admin/addColleges/next/alumni?collegeId=${collegeId}`);
    }
    req.session.message = {
      type: "success",
      message: "Alumni updated successfully",
    };
    return res.redirect(`/admin/addColleges/next/alumni?collegeId=${collegeId}`);
  } catch (error) {
    console.error(error);
    req.session.message = {
      type: "danger",
      message: "Internal Server Error",
    };
    return res.redirect(`/admin/addColleges/next/alumni?collegeId=${collegeId}`);
  }
};

module.exports = {
  viewAlunmi,
  createAlum,
  deleteAlumni,
  editAlumniView,
  editAlum,
};
