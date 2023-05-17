const exprss = require("express");
const controller = require("../controller/collegeController");
const web = exprss.Router();

// Home page
web.get("/", controller.homePage);

// Blogs page
web.get("/blogs", controller.blogsPage);

// Blogs Detail page
web.get("/blogsDetail", controller.blogsDetailPage);

// topclg page
web.get("/topclg", controller.topclgPage);

// view college page
web.get("/view", controller.viewPage);

// admin page
web.get("/admin",(req,res) => {
    res.render("admin/admin", { title: "selectmycollege Admin" });
})

// add colleges
web.get("/addColleges",(req,res) =>{
    res.render("admin/addCollege",{title: "selectmycollege Add College"})
})

module.exports = web;
