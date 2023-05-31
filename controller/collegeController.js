const fs = require("fs");
const College = require("../model/collegeModel");
const Course = require("../model/courseModel");
const Fee = require("../model/feeModel");
const City = require("../model/cityModel");
const State = require("../model/stateModel");

// index page
const homePage = async (req, res) => {
  res.render("index", { title: "selectmycollege" });
};

const topclgPage = async (req, res) => {
  res.render("topclg", { title: "selectmycollege" });
};

// Controller for getting a specific college by ID
const viewPage = async (req, res) => {
  res.render("view", { title: "selectmycollege" });
};
const getCollegeById = async (req, res) => {
  try {
    const college = await College.findById(req.params.id);

    if (!college) {
      return res.status(404).json({ error: "College not found" });
    }

    // Render the EJS template
    // res.render("view", {
    //   college,
    //   title: "College Details",
    // });
    res.status(200).json({ college });
  } catch (error) {
    console.error("Error getting college:", error);
    res.status(500).json({ error: "Error getting college" });
  }
};

const adminPage = async (req, res) => {
  try {
    const collegeCount = await College.countDocuments();
    const courseCount = await Course.countDocuments();

    res.render("admin/admin", {
      title: "selectmycollege Admin",
      collegeCount,
      courseCount,
    });
  } catch (error) {
    console.error("Error getting count:", error);
    req.session.message = "Error getting count";
    res.redirect("/admin");
  }
};

/** CREATE COLLEGE STARTS HERE */
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
    res.status(500).json({ error: "Error retrieving cities" });
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
      clgLogo,
      images,
      description,
    } = req.body;

    if (!(name && address && pinCode)) {
      req.session.message = {
        type: "danger",
        message: "All inputs are required",
      };
      return res.redirect("/addColleges");
    }

    const collegeExists = await College.findOne({ name });
    if (collegeExists) {
      req.session.message = {
        type: "danger",
        message: "College already exists",
      };
      return res.redirect("/addColleges");
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
    return res.redirect(`/addColleges/next?collegeId=${college._id}`);
  } catch (error) {
    console.error("Error creating college:", error);
    req.session.message = "Error creating college";
    return res.redirect("/addColleges");
  }
};

const createCollegeTwoView = async (req, res) => {
  try {
    const { collegeId } = req.query;
    const college = await College.findById(collegeId);
    const courses = await Course.find();
    const fee = await Fee.find({ collegeId });
    let collegeName, courseName;
    const populatedFee = await Promise.all(
      fee.map(async (feeDoc) => {
        const cn = await College.findById(feeDoc.collegeId);
        if (!Array.isArray(cn) && cn) {
          collegeName = cn.name;
        } else {
          collegeName = null;
        }
        const con = await Course.findById(feeDoc.courseId);
        if (!Array.isArray(con) && con) {
          courseName = con.name;
        } else {
          courseName = null;
        }
        // console.log(con);
        const totalFee = feeDoc.fees.reduce(
          (sum, [_, value]) => sum + parseFloat(value),
          0
        );
        return {
          ...feeDoc.toObject(),
          collegeName,
          courseName,
          totalFee,
        };
      })
    );
    res.render("admin/addCollegeTwo", {
      college,
      courses,
      fee: populatedFee,
      title: "next",
    });
  } catch (error) {
    console.error("Error retrieving college, courses, and fees:", error);
    req.session.message = "Server Error! Please try agian later.";
    return res.redirect("/allColleges");
  }
};

const createCollegeTwo = async (req, res) => {
  const { courseSelect, addCourse, duration, fee } = req.body;
  const collegeId = req.query.collegeId;

  try {
    let courseId;
    if (courseSelect === "Other") {
      const course = await Course.create({
        name: addCourse,
        duration,
      });
      courseId = course._id;
    } else {
      courseId = courseSelect;
    }
    await Fee.create({
      collegeId,
      courseId,
      fees: fee,
    });
    return res.redirect(`/addColleges/next?collegeId=${collegeId}`);
  } catch (error) {
    console.error("Error creating college:", error);
    res.status(500).json({ error: "Error creating college" });
  }
};

/** CREATE COLLEGE ENDS HERE */

const deleteCourseTwo = async (req, res) => {
  const collegeId = req.params.id;
  const feeId = req.params.feeId;
  try {
    // Delete the fee based on the feeId
    await Fee.findByIdAndRemove(feeId);
    return res.redirect(`/addColleges/next?collegeId=${collegeId}`);
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
        `/addColleges/next?collegeId=${updatedFee.collegeId}`
      );
    }

    updatedFee.fees = fee;
    await updatedFee.save();

    req.session.message = "Fee updated successfully";
    return res.redirect(`/addColleges/next?collegeId=${updatedFee.collegeId}`);
  } catch (error) {
    console.error("Error updating college course:", error);
    req.session.message = "Error updating college course";
    return res.redirect("/allColleges");
  }
};

/** GET ALL COLLEGES STARTS HERE */

const getAllColleges = async (req, res) => {
  try {
    const colleges = await College.find().populate("city state");
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
      // images,
    } = req.body;

    const college = await College.findById(req.params.id);
    let new_logo = "";
    if (!college) {
      return res.status(404).json({ error: "College not found" });
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

    college.name = name;
    college.address = address;
    college.state = state;
    college.city = city;
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
    res.redirect("/allColleges");
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
    res.redirect("/allColleges");
    // res.status(500).json({ error: "Error deleting college" });
  }
};
/** DELETE COLLEGE ENDS HERE */

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
  getCollegeById,
  createCollegeTwo,
  createCollegeTwoView,
  deleteCourseTwo,
  editCollegeCourse,
  editCollegeCourseView,
};
