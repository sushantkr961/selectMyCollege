const Lead = require("../model/leadsModel");

const leadsPage = async (req, res) => {
  try {
    const leads = await Lead.find();
    res.render("admin/leads", { title: "selectmycollege All Colleges", leads });
  } catch (error) {
    console.error("Error retrieving leads:", error);
    req.session.message = {
      type: "error",
      text: "Error retrieving leads",
    };
    res.render("admin/leads", { title: "selectmycollege All Colleges" });
  }
};

const createLead = async (req, res) => {
  try {
    const { name, email, phoneNo, course, marks, city } = req.body;
    const lead = await Lead.create({
      name,
      email,
      phoneNo,
      course,
      marks,
      city,
    });
    res.status(201).json({ message: "Lead created successfully", lead });
  } catch (error) {
    console.error("Error creating lead:", error);
    res.status(500).json({ error: "Error creating lead" });
  }
};

module.exports = {
  leadsPage,
  createLead,
};
