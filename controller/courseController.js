const Course = require("../model/courseModel");

const addCoursesPageView = async (req, res) => {
  res.render("admin/addCourses", { title: "selectmycollege Add College" });
};

const viewCoursesPageView = async (req, res) => {
  res.render("admin/viewCourses", { title: "selectmycollege All Colleges" });
};

const editCourseView = async (req, res) => {
  res.render("admin/editCourse"), { title: "edit course" };
};

const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find({});
    res.json(courses);
  } catch (error) {
    console.log(error);
  }
};

const postCourses = async (req, res) => {
  try {
    const { name, duration } = req.body;
    console.log(req.body);
    if (!name || !duration) {
      return res.status(400).send("Course name and duration are required");
    }
    const courseExists = await Course.findOne({ name });
    if (courseExists) {
      return res.status(400).send("Course already exists");
    }
    const course = await Course.create({
      name,
      duration: duration,
    });
    res.status(201).send({ course });
  } catch (error) {
    console.error("Error creating course:", error);
    res.status(500).send("Error creating course");
  }
};

const deleteCourse = async (req, res) => {
  try {
    const courseId = req.params.id;
    const deletedCourse = await Course.findByIdAndDelete(courseId);
    if (!deletedCourse) {
      return res.status(404).send("Course not found");
    }
    res.status(200).send("Course deleted successfully");
  } catch (error) {
    console.error("Error deleting course:", error);
    res.status(500).send("Error deleting course");
  }
};

const saveAttr = async (req, res) => {
  const { key, val, courseChoosen } = req.body;
  if (!key || !val || !courseChoosen) {
    return res.status(400).send("All inputs are required");
  }
  try {
    const name = courseChoosen.split("/")[0];

    // Find the course by name
    const course = await Course.findOne({ name });

    if (!course) {
      return res.status(404).send("Course not found");
    }

    let keyNotExistsInDB = true;

    // Check if the key exists in the attributes array
    course.attrs.forEach((item, idx) => {
      if (item.key === key) {
        keyNotExistsInDB = false;

        // Add the new value to the existing key
        const copyAttributeValues = [...course.attrs[idx].value];
        copyAttributeValues.push(val);
        const newAttributeValues = [...new Set(copyAttributeValues)]; // set ensures unique values
        course.attrs[idx].value = newAttributeValues;
      }
    });

    if (keyNotExistsInDB) {
      // Add a new key-value pair to the attributes array
      course.attrs.push({ key: key, value: [val] });
    }

    // Save the updated course to the database
    await course.save();

    // Retrieve the updated categories (assuming you have a `categories` collection)
    const courseUpdated = await Course.find();

    return res.status(201).json({ courseUpdated });
  } catch (error) {
    console.error("Error saving attribute:", error);
    res.status(500).send("Error saving attribute");
  }
};

module.exports = {
  addCoursesPageView,
  viewCoursesPageView,
  editCourseView,
  getAllCourses,
  postCourses,
  deleteCourse,
  saveAttr,
};
