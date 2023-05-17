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

module.exports = { homePage, blogsPage, blogsDetailPage, topclgPage, viewPage };
