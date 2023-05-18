const College = require("../model/collegeModel")


// index page
const homePage = async (req, res) => {
  res.render("index", { title: "selectmycollege" });
};

const blogsPage = async (req, res) => {
  res.render("blogs", { title: "selectmycollege" });
};

const blogsDetailPage = async (req, res) => {
  res.render("blogsDetail", { title: "selectmycollege" });
};

const topclgPage = async (req, res) => {
  res.render("topclg", { title: "selectmycollege" });
};

const viewPage = async (req, res) => {
  res.render("view", { title: "selectmycollege" });
};

const adminPage = async(req,res) => {
  res.render("admin/admin", { title: "selectmycollege Admin" });
}

// const addCollegesPage = async(req,res) =>{
//   res.render("admin/addCollege",{title: "selectmycollege Add College"})
// }

// Controller for creating a college
const addCollegesPage = async (req, res) => {
  try {
    const { name, location, courseType, facilities } = req.body;

    const college = await College.create({
      name,
      location,
      courseType,
      facilities
    });

    res.status(201).json({ college });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create college' });
  }
};

const allCollegesPage = async(req,res) =>{
  res.render("admin/allColleges",{title: "selectmycollege All Colleges"})
}

const addCoursesPage = async(req,res) =>{
  res.render("admin/addCourses",{title: "selectmycollege Add College"})
}

const viewCoursesPage = async(req,res) =>{
  res.render("admin/viewCourses",{title: "selectmycollege All Colleges"})
}

const leadsPage = async(req,res) =>{
  res.render("admin/leads",{title: "selectmycollege All Colleges"})
}

module.exports = { homePage, blogsPage, blogsDetailPage, topclgPage, viewPage, adminPage, addCollegesPage, allCollegesPage, addCoursesPage, viewCoursesPage, leadsPage };
