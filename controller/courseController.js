const addCoursesPage = async (req, res) => {
  res.render("admin/addCourses", { title: "selectmycollege Add College" });
};

const viewCoursesPage = async (req, res) => {
  res.render("admin/viewCourses", { title: "selectmycollege All Colleges" });
};

module.exports = {
  addCoursesPage,
  viewCoursesPage,
};
