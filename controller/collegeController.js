const fs = require("fs");
const College = require("../model/collegeModel");

// index page
const homePage = async (req, res) => {
  res.render("index", { title: "selectmycollege" });
};

const topclgPage = async (req, res) => {
  res.render("topclg", { title: "selectmycollege" });
};

const viewPage = async (req, res) => {
  res.render("view", { title: "selectmycollege" });
};

const adminPage = async (req, res) => {
  res.render("admin/admin", { title: "selectmycollege Admin" });
};

/** CREATE COLLEGE STARTS HERE */
const createCollegeView = async (req, res) => {
  res.render("admin/addCollege", { title: "selectmycollege Admin" });
};

// Controller for creating a college
const createCollege = async (req, res) => {
  try {
    const { name, address, state, pinCode, city, facilities, clgLogo, images } =
      req.body;

    // Check if all required inputs are present
    if (!(name && address && state && pinCode && city)) {
      req.session.message = {
        type: "danger",
        message: "All inputs are required",
      };
      return res.status(400).json({ error: "All inputs are required" });
    }

    // Check if college already exists
    const collegeExists = await College.findOne({ name });
    if (collegeExists) {
      req.session.message = {
        type: "danger",
        message: "College already exists",
      };
      return res.status(400).json({
        error: "College already exists",
        message: "College already exists",
      });
    }

    // Create the new college document
    const college = await College.create({
      name,
      address,
      state,
      pinCode,
      city,
      facilities,
      clgLogo: req.file.filename,
      images,
    });
    req.session.message = {
      type: "success",
      message: "College created successfully",
    };
    // res.status(201).json({ message: "College created successfully", college });
    res.redirect("/allColleges");
  } catch (error) {
    console.error("Error creating college:", error);
    req.session.message = "Error creating college";
    res.status(500).json({ error: "Error creating college" });
  }
};
/** CREATE COLLEGE ENDS HERE */

/** GET ALL COLLEGES STARTS HERE */
const getAllColleges = async (req, res) => {
  try {
    const colleges = await College.find();
    // res.status(200).json({ colleges }); // by using this ejs file doesn't render

    // Render the EJS template
    res.render("admin/allColleges", {
      colleges,
      title: "allColleges",
    });
  } catch (error) {
    console.error("Error getting colleges:", error);
    res.status(500).json({ error: "Error getting colleges" });
  }
};
/** GET ALL COLLEGES ENDS HERE */

// Controller for getting a specific college by ID
// const getCollegeById = async (req, res) => {
//   try {
//     const college = await College.findById(req.params.id);
//     if (!college) {
//       return res.status(404).json({ error: "College not found" });
//     }
//     res.status(200).json({ college });
//   } catch (error) {
//     console.error("Error getting college:", error);
//     res.status(500).json({ error: "Error getting college" });
//   }
// };

// const updateCollegeView = async (req, res) => {
//   res.render("admin/editCollege", { title: "selectmycollege Admin" });
// };
const updateCollegeView = async (req, res) => {
  try {
    const college = await College.findById(req.params.id);
    if (!college) {
      return res.status(404).json({ error: "College not found" });
    }
    res.render("admin/editCollege", {
      title: "update college",
      college,
    });
    // res.status(200).json({ college });
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
      clgLogo,
      // images,
    } = req.body;

    const college = await College.findById(req.params.id);
    if (!college) {
      return res.status(404).json({ error: "College not found" });
    }

    college.name = name;
    college.address = address;
    college.state = state;
    college.city = city;
    college.url = url;
    college.facilities = facilities;
    college.clgLogo = clgLogo;
    college.pinCode = pinCode;
    college.description = description;
    // college.images = images;

    await college.save();

    res.status(200).json({ message: "College updated successfully", college });
  } catch (error) {
    console.error("Error updating college:", error);
    res.status(500).json({ error: "Error updating college" });
  }
};

/** DELETE COLLEGE START HERE */
// Controller for DELETE college
const deleteCollege = async (req, res) => {
  try {
    const { id } = req.params;
    // Find the college by ID
    const college = await College.findOneAndRemove({ _id: id });
    if (!college) {
      return res.status(404).json({ error: "College not found" });
    }
    // Delete the corresponding images from the uploads folder
    if (college.clgLogo) {
      const imagePath = "uploads/" + college.clgLogo;
      // console.log("Image path:", imagePath);
      fs.unlinkSync(imagePath);
    }
    req.session.message = {
      type: "info",
      message: "College Deleted Successfully!",
    };
    res.redirect("/allColleges");
  } catch (error) {
    console.error("Error deleting college:", error);
    req.session.message = {
      type: "danger",
      message: "Error deleting college",
    };
    res.status(500).json({ error: "Error deleting college" });
  }
};
/** CREATE COLLEGE ENDS HERE */

module.exports = {
  homePage,
  topclgPage,
  viewPage,
  adminPage,
  createCollege,
  createCollegeView,
  getAllColleges,
  updateCollege,
  updateCollegeView,
  deleteCollege,
};
