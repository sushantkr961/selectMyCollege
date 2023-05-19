

// index page
const homePage = async (req, res) => {
  res.render("index", { title: "selectmycollege" });
};

const topclgPage = async (req, res) => {
  res.render("topclg", { title: "selectmycollege" });
};

const viewPage = async (req, res) => {
  res.render("view", { title: "selectmycollege" });
};

const adminPage = async (req, res) => {
  res.render("admin/admin", { title: "selectmycollege Admin" });
};

// Controller for creating a college
const createCollege = async (req, res) => {
  try {
    const { name, address, state, city, facilities, logo, images } =
      req.body;
      console.log(req.body)

    const college = await .create({
      name,
      address,
      state,
      city,
      facilities,
      logo,
      images,
    });

    await college.save();

    res.status(201).json({ message: "College created successfully", college });
  } catch (error) {
    console.error("Error creating college:", error);
    res.status(500).json({ error: "Error creating college" });
  }
};

// Controller for getting all colleges
const getAllColleges = async (req, res) => {
  try {
    const colleges = await College.find();
    res.status(200).json({ colleges });
  } catch (error) {
    console.error("Error getting colleges:", error);
    res.status(500).json({ error: "Error getting colleges" });
  }
};

// Controller for getting a specific college by ID
const getCollegeById = async (req, res) => {
  try {
    const college = await College.findById(req.params.id);
    if (!college) {
      return res.status(404).json({ error: "College not found" });
    }
    res.status(200).json({ college });
  } catch (error) {
    console.error("Error getting college:", error);
    res.status(500).json({ error: "Error getting college" });
  }
};

// Controller for updating a college
const updateCollege = async (req, res) => {
  try {
    const { name, address, state, city, courseType, facilities, logo, images } =
      req.body;

    const college = await College.findById(req.params.id);
    if (!college) {
      return res.status(404).json({ error: "College not found" });
    }

    college.name = name;
    college.address = address;
    college.state = state;
    college.city = city;
    college.courseType = courseType;
    college.facilities = facilities;
    college.logo = logo;
    college.images = images;

    await college.save();

    res.status(200).json({ message: "College updated successfully", college });
  } catch (error) {
    console.error("Error updating college:", error);
    res.status(500).json({ error: "Error updating college" });
  }
};

// Controller for deleting a college
const deleteCollege = async (req, res) => {
  try {
    const college = await College.findByIdAndDelete(req.params.id);
    if (!college) {
      return res.status(404).json({ error: "College not found" });
    }
    res.status(200).json({ message: "College deleted successfully" });
  } catch (error) {
    console.error("Error deleting college:", error);
    res.status(500).json({ error: "Error deleting college" });
  }
};

module.exports = {
  homePage,
  topclgPage,
  viewPage,
  adminPage,
  createCollege,
  getAllColleges,
  getCollegeById,
  updateCollege,
  deleteCollege,
};
