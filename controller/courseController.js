const College = require("../model/collegeModel");
const Course = require("../model/courseModel");
const Fee = require("../model/feeModel");

const createCourseView = async (req, res) => {
  try {
    const { collegeId } = req.query;
    const college = await College.findById(collegeId);
    const courses = await Course.find({ percouid: 0 });
    const subCourses = await Course.find({ percouid: { $ne: 0 } }); // Find subcourses
    const fee = await Fee.find({ collegeId });
    res.render("admin/addCollegeTwo", {
      college,
      courses,
      subCourses,
      fee,
      title: "next",
    });
  } catch (error) {
    console.error("Error retrieving college, courses, and fees:", error);
    req.session.message = {
      type: "danger",
      message: "Server Error! Please try again later.",
    };
    return res.redirect("/allColleges");
  }
};

const getsubcourse = async (req, res) => {
  const coursesid = req.params.id;
  const tsc = await Course.find({ percouid: coursesid });
  let aa = `<option>Select Sub Course</option>`;
  if (tsc.length > 0) {
    tsc.map((course) => {
      aa +=
        `<option class="p-3" value="` +
        course._id +
        `">` +
        course.name +
        `</option>`;
    });
  } else {
    aa += `<option>No Sub Course</option>`;
  }
  aa += `<option>Other</option>`;
  return res.json({ haha: aa });
};

const createCourse = async (req, res) => {
  const {
    courseSelect,
    subCourseSelect,
    addCourse,
    addSubCourse,
    duration,
    fee,
  } = req.body;
  const collegeId = req.query.collegeId;
  // console.log(req.body);
  try {
    let courseId;
    if (courseSelect === "Other") {
      if (subCourseSelect === "Other") {
        const course = await Course.create({
          name: addCourse,
        });
        let mcourseId = course._id;
        const subcourse = await Course.create({
          name: addSubCourse,
          duration,
          percouid: mcourseId,
        });
        courseId = subcourse._id;
      } else {
        const course = await Course.create({
          name: addCourse,
          duration,
        });
        courseId = course._id;
      }
    } else {
      if (subCourseSelect === "Other") {
        const course = await Course.create({
          name: addSubCourse,
          duration,
          percouid: courseSelect,
        });
        courseId = course._id;
      } else if (subCourseSelect === "No Sub Course") {
        courseId = courseSelect;
      } else {
        courseId = subCourseSelect;
      }
    }
    let totalFee = 0;
    fee.map((feeSum) => {
      totalFee += Number(feeSum[1]); // Convert string to number before adding
    });

    await Fee.create({
      collegeId,
      courseId,
      fees: fee,
      totalFee: totalFee, // Save the total fee
    });

    return res.redirect(`/admin/addColleges/next?collegeId=${collegeId}`);
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
    return res.redirect(`/admin/addColleges/next?collegeId=${collegeId}`);
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
        `/admin/addColleges/next?collegeId=${updatedFee.collegeId}`
      );
    }

    updatedFee.fees = fee;
    await updatedFee.save();

    req.session.message = "Fee updated successfully";
    return res.redirect(
      `/admin/addColleges/next?collegeId=${updatedFee.collegeId}`
    );
  } catch (error) {
    console.error("Error updating college course:", error);
    req.session.message = "Error updating college course";
    return res.redirect("/allColleges");
  }
};

// const allCoursesView = async (req, res) => {
//   try {
//     const courses = await Course.find();
//     console.log(courses);
//     res.render("admin/allCourses", { courses, title: "selectMyCollege" });
//   } catch (error) {
//     console.error("Error retrieving courses:", error);
//     res.status(500).send("Internal Server Error");
//   }
// };

const allCoursesView = async (req, res) => {
  try {
    const mainCourses = await Course.find({ percouid: 0 });
    const subCourses = await Course.find({ percouid: { $ne: 0 } });

    const courses = mainCourses.map((course) => {
      const relatedSubCourses = subCourses.filter(
        (subCourse) => subCourse.percouid.toString() === course._id.toString()
      );
      return {
        ...course._doc,
        subCourses: relatedSubCourses,
      };
    });

    console.log(courses);
    res.render("admin/allCourses", { courses, title: "selectMyCollege" });
  } catch (error) {
    console.error("Error retrieving courses:", error);
    res.status(500).send("Internal Server Error");
  }
};

const deleteCourse = async (req, res) => {
  try {
    const courseId = req.params.id;
    if (!courseId) {
      req.session.message = { type: "danger", message: "CourseId is required" };
      return res.redirect("/allCourses");
    }
    const deletedCourse = await Course.findByIdAndDelete(courseId);
    if (!deletedCourse) {
      req.session.message = { type: "danger", message: "Course not found" };
      return res.redirect("/allCourses");
    }
    req.session.message = {
      type: "success",
      message: "Course deleted successfully",
    };
    res.redirect("/allCourses");
  } catch (error) {
    console.error("Error deleting course:", error);
    req.session.message = { type: "danger", message: "Internal Server Error" };
    res.redirect("/allCourses");
  }
};

// const updateCourseView = async (req, res) => {
//   try {
//     const courseId = req.params.id;
//     const course = await Course.findById(courseId);
//     if (!course) {
//       return res.status(404).json({ message: "Course not found" });
//     }
//     res.render("admin/editCourses", {
//       title: "Update Course",
//       course,
//     });
//   } catch (error) {
//     console.error("Error retrieving course:", error);
//     res.redirect(`/allCourses`);
//   }
// };

const updateCourseView = async (req, res) => {
  try {
    const courseId = req.params.id;
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const subCourses = await Course.find({ percouid: courseId });

    res.render("admin/editCourses", {
      title: "Update Course",
      course,
      subCourses,
    });
  } catch (error) {
    console.error("Error retrieving course:", error);
    res.redirect(`/allCourses`);
  }
};

const updateCourse = async (req, res) => {
  try {
    const courseId = req.params.id;
    const updatedCourseData = req.body;
    const updatedCourse = await Course.findByIdAndUpdate(
      courseId,
      updatedCourseData,
      { new: true }
    );
    if (!updatedCourse) {
      req.session.message = { type: "danger", message: "Course not found" };
      return res.redirect("/allCourses");
    }
    req.session.message = {
      type: "success",
      message: "Course updated successfully",
    };
    res.redirect("/allCourses");
  } catch (error) {
    console.error("Error updating course:", error);
    req.session.message = { type: "danger", message: "Internal Server Error" };
    res.redirect("/allCourses");
  }
};

module.exports = {
  createCourse,
  createCourseView,
  editCollegeCourseView,
  deleteCourseTwo,
  editCollegeCourse,
  allCoursesView,
  deleteCourse,
  updateCourse,
  updateCourseView,
  getsubcourse,
};
