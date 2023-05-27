const fs = require("fs");
const College = require("../model/collegeModel");
const Course = require("../model/courseModel");
const Fee = require("../model/feeModel");

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
  res.render("admin/admin", { title: "selectmycollege Admin" });
};

/** CREATE COLLEGE STARTS HERE */
const createCollegeView = async (req, res) => {
  res.render("admin/addCollege", { title: "selectmycollege Admin" });
};
// Controller for creating a college
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

    // Check if all required inputs are present
    if (!(name && address && state && pinCode && city)) {
      req.session.message = {
        type: "danger",
        message: "All inputs are required",
      };
      return res.redirect("/addColleges");
      // return res.status(400).json({ error: "All inputs are required" });
    }

    // Check if college already exists
    const collegeExists = await College.findOne({ name });
    if (collegeExists) {
      req.session.message = {
        type: "danger",
        message: "College already exists",
      };
      return res.redirect("/addColleges");
    }

    // Create the new college document
    const college = await College.create({
      name,
      address,
      state,
      pinCode,
      city,
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
    const fee = await Fee.find({ collegeId: collegeId });

    const populatedFee = await Promise.all(
      fee.map(async (feeDoc) => {
        const collegeName = (await College.findById(feeDoc.collegeId)).name;
        const courseName = (await Course.findById(feeDoc.courseId)).name;
        return {
          ...feeDoc.toObject(),
          collegeName,
          courseName,
        };
      })
    );

    // console.log(populatedFee);
    res.render("admin/addCollegeTwo", {
      college,
      courses,
      fee: populatedFee,
      title: "next",
    });
  } catch (error) {
    console.error("Error retrieving college, courses, and fees:", error);
    req.session.message = "Error retrieving college";
    return res.redirect("/allColleges");
  }
};

// const createCollegeTwo = async (req, res) => {
//   const { courseSelect, addCourse, duration, fee } = req.body;

//   if (courseSelect === "Other") {
//     const course = await Course.create({
//       name: addCourse,
//       duration,
//     });
//     const collegeId = req.query.collegeId;
//     const courseId = course._id;
//     await Fee.create({
//       collegeId,
//       courseId,
//       fees: fee,
//     });
//     return res.redirect(`/addColleges/next?collegeId=${collegeId}`);
//   } else {
//     const collegeId = req.query.collegeId;
//     const courseId = req.body.courseSelect;
//     await Fee.create({
//       collegeId,
//       courseId,
//       fees: fee,
//     });
//     return res.redirect(`/addColleges/next?collegeId=${collegeId}`);
//   }
// };

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
  const collegeId = req.params.collegeId;
  const feeId = req.params.feeId;
  console.log(collegeId);

  try {
    // Delete the fee based on the feeId
    await Fee.findByIdAndRemove(feeId);
    return res.redirect(`/addColleges/next?collegeId=${collegeId}`);
  } catch (error) {
    console.error("Error deleting course:", error);
    res.status(500).json({ error: "Error deleting course" });
  }
};

/** GET ALL COLLEGES STARTS HERE */
// const getAllColleges = async (req, res) => {
//   try {
//     const colleges = await College.find();
//     const courses = await Course.find();
//     const fees = await Fee.find().populate("collegeId courseId");

//     if (!colleges || !courses || !fees) {
//       throw new Error("Error retrieving college, courses, and fees");
//     }

//     // Calculate the total fee for each fee structure
//     const feesWithTotal = fees.map((fee) => ({
//       ...fee.toJSON(),
//       totalFee: fee.totalFee.toFixed(2),
//     }));
//        res.status(200).json({ colleges, fees: feesWithTotal });

//     res.render("admin/allColleges", {
//       colleges,
//       courses,
//       feesWithTotal,
//       title: "allColleges",
//     });
//   } catch (error) {
//     console.error("Error retrieving college, courses, and fees:", error);
//     res
//       .status(500)
//       .json({ error: "Error retrieving college, courses, and fees" });
//   }
// };

const getAllColleges = async (req, res) => {
  try {
    const colleges = await College.find();
    const fees = await Fee.find().populate("collegeId courseId");
    // Calculate the total fee for each fee structure
    const feesWithTotal = fees.map((fee) => {
      const totalFee = fee.fees.reduce((sum, currentFee) => {
        return sum + parseInt(currentFee[1]);
      }, 0);
      return {
        ...fee.toJSON(),
        totalFee: totalFee.toFixed(2),
      };
    });
    res.status(200).json({ colleges, fees: feesWithTotal }); // by using this ejs file doesn't render
    res.render("admin/allColleges", {
      colleges,
      feesWithTotal,
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
};
