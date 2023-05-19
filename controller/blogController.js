const blogsPage = async (req, res) => {
  res.render("blogs", { title: "selectmycollege" });
};

const blogsDetailPage = async (req, res) => {
  res.render("blogsDetail", { title: "selectmycollege" });
};

module.exports = {
  blogsPage,
  blogsDetailPage,
};
