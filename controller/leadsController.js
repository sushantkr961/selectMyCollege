const leadsPage = async (req, res) => {
  res.render("admin/leads", { title: "selectmycollege All Colleges" });
};

module.exports = {
  leadsPage,
};
