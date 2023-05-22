const addCoursesPage = async (req, res) => {
  res.render("admin/addCourses", { title: "selectmycollege Add College" });
};

const viewCoursesPage = async (req, res) => {
  res.render("admin/viewCourses", { title: "selectmycollege All Colleges" });
};

const editCourse = async (req, res) => {
  res.render("admin/editCourse"), { title: "edit course" };
};

module.exports = {
  addCoursesPage,
  viewCoursesPage,
  editCourse,
};
