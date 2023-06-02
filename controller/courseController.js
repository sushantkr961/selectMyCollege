const College = require("../model/collegeModel");
const Course = require("../model/courseModel");
const Fee = require("../model/feeModel");

const createCourseView = async (req, res) => {
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

const createCourse = async (req, res) => {
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

module.exports = {
  createCourse,
  createCourseView,
  editCollegeCourseView,
  deleteCourseTwo,
  editCollegeCourse,
};
