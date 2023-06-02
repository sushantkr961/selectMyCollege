const fs = require("fs");
const College = require("../model/collegeModel");
const Course = require("../model/courseModel");
const City = require("../model/cityModel");
const State = require("../model/stateModel");
const Gallery = require("../model/galleryModel");
const Alumni = require("../model/alumniModel");

// index page
const homePage = async (req, res) => {
  const cities = City.find();
  res.render("index", { title: "selectmycollege" });
};

const topclgPage = async (req, res) => {
  res.render("topclg", { title: "selectmycollege" });
};

// Controller for getting a specific college by ID
const viewPage = async (req, res) => {
  res.render("view", { title: "selectmycollege" });
};
const getCollegeById = async (req, res) => {
  try {
    const college = await College.findById(req.params.id);

    if (!college) {
      return res.status(404).json({ error: "College not found" });
    }

    // Render the EJS template
    // res.render("view", {
    //   college,
    //   title: "College Details",
    // });
    res.status(200).json({ college });
  } catch (error) {
    console.error("Error getting college:", error);
    res.status(500).json({ error: "Error getting college" });
  }
};

const adminPage = async (req, res) => {
  try {
    const collegeCount = await College.countDocuments();
    const courseCount = await Course.countDocuments();
    const alumniCount = await Alumni.countDocuments();

    res.render("admin/admin", {
      title: "selectmycollege Admin",
      collegeCount,
      courseCount,
      alumniCount,
    });
  } catch (error) {
    console.error("Error getting count:", error);
    req.session.message = "Error getting count";
    res.redirect("/admin");
  }
};

/** CREATE COLLEGE STARTS HERE */
const createCollegeView = async (req, res) => {
  try {
    const citiesPromise = City.find();
    const statesPromise = State.find();
    const [cities, states] = await Promise.all([citiesPromise, statesPromise]);

    res.render("admin/addCollege", {
      title: "selectmycollege Admin",
      cities,
      states,
    });
  } catch (error) {
    console.error("Error retrieving cities:", error);
    res.status(500).json({ error: "Error retrieving cities" });
  }
};

const createCollege = async (req, res) => {
  try {
    const {
      name,
      address,
      state,
      pinCode,
      city,
      facilities,
      shortName,
      clgLogo,
      images,
      description,
    } = req.body;

    if (!(name && address && pinCode)) {
      req.session.message = {
        type: "danger",
        message: "All inputs are required",
      };
      return res.redirect("/addColleges");
    }

    const collegeExists = await College.findOne({ name });
    if (collegeExists) {
      req.session.message = {
        type: "danger",
        message: "College already exists",
      };
      return res.redirect("/addColleges");
    }

    let selectedCity;
    if (Array.isArray(city)) {
      // Take the first city name from the array
      const cityName = city[0];
      selectedCity = await City.findOne({ cityName });
      if (!selectedCity) {
        selectedCity = await City.create({ cityName });
      }
    } else {
      selectedCity = await City.findOne({ cityName: city });
      if (!selectedCity) {
        selectedCity = await City.create({ cityName: city });
      }
    }

    let selectedState;
    if (Array.isArray(state)) {
      // Take the first state name from the array
      const stateName = state[0];
      selectedState = await State.findOne({ stateName });
      if (!selectedState) {
        selectedState = await State.create({ stateName: state });
      }
    } else {
      selectedState = await State.findOne({ stateName: state });
      if (!selectedState) {
        selectedState = await State.create({ stateName: state });
      }
    }

    const college = await College.create({
      name,
      address,
      state: selectedState._id,
      pinCode,
      city: selectedCity._id,
      facilities,
      shortName,
      clgLogo: "uploads/" + req.file.filename,
      images,
      description,
    });

    req.session.message = {
      type: "success",
      message: "College created successfully",
    };
    return res.redirect(`/addColleges/next?collegeId=${college._id}`);
  } catch (error) {
    console.error("Error creating college:", error);
    req.session.message = "Error creating college";
    return res.redirect("/addColleges");
  }
};

const createImageGalleryView = async (req, res) => {
  const { collegeId } = req.query;
  try {
    const college = await College.findById(collegeId);
    if (!college) {
      return res.status(404).send("College not found");
    }
    const galleryImages = await Gallery.find({ collegeId });

    res.render("admin/addImageGallery", {
      title: "selectmycollege",
      college,
      galleryImages,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};

const createImageGallery = async (req, res) => {
  const files = req.files;
  const { collegeId } = req.query;
  const { banners } = req.body;
  try {
    const college = await College.findById(collegeId);
    if (!college) {
      return res.status(404).send("College not found");
    }
    const galleryImages = files.map((file) => ({
      image: "uploads/" + file.filename,
      collegeId: collegeId,
      banners: banners === "true",
    }));
    const createdImages = await Gallery.create(galleryImages);
    college.images = college.images || [];
    college.images = college.images.concat(
      createdImages.map((image) => image._id)
    );
    await college.save();
    res.redirect(`/addColleges/next/gallery?collegeId=${collegeId}`);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};

const deleteImage = async (req, res) => {
  const { collegeId, imageId } = req.params;

  try {
    const deletedImage = await Gallery.findOneAndRemove({ _id: imageId });
    if (!deletedImage) {
      req.session.message = {
        type: "error",
        message: "Image not found",
      };
      return res.redirect(`/addColleges/next/gallery?collegeId=${collegeId}`);
    }
    fs.unlinkSync("public/" + deletedImage.image);
    res.redirect(`/addColleges/next/gallery?collegeId=${collegeId}`);
  } catch (err) {
    console.error(err);
    req.session.message = {
      type: "error",
      message: "Internal Server Error",
    };
    res.redirect(`/addColleges/next/gallery?collegeId=${collegeId}`);
  }
};
/** CREATE COLLEGE ENDS HERE */

/** GET ALL COLLEGES STARTS HERE */

const getAllColleges = async (req, res) => {
  try {
    const colleges = await College.find().populate("city state");
    res.render("admin/allColleges", {
      colleges,
      title: "allColleges",
    });
  } catch (error) {
    console.error("Error getting colleges:", error);
    res.status(500).json({ error: "Error getting colleges" });
  }
};

/** GET ALL COLLEGES ENDS HERE */

/** UPDATE COLLEGES STARTS HERE */
const updateCollegeView = async (req, res) => {
  try {
    const college = await College.findById(req.params.id).populate(
      "city state"
    );
    const cities = await City.find();
    const states = await State.find();

    if (!college) {
      return res.status(404).json({ error: "College not found" });
    }
    res.render("admin/editCollege", {
      title: "Update College",
      college,
      cities,
      states,
    });
  } catch (error) {
    console.error("Error getting college:", error);
    res.status(500).json({ error: "Error getting college" });
  }
};

// Controller for updating a college
const updateCollege = async (req, res) => {
  try {
    const {
      name,
      address,
      stateId,
      pinCode,
      cityId,
      url,
      description,
      facilities,
      shortName,
      clgLogo,
      // images,
    } = req.body;

    const college = await College.findById(req.params.id);
    let new_logo = "";
    if (!college) {
      return res.status(404).json({ error: "College not found" });
    }
    if (req.file) {
      new_logo = "uploads/" + req.file.filename;
      try {
        fs.unlinkSync("public/" + req.body.old_clgLogo);
      } catch (error) {
        console.log(error);
      }
    } else {
      new_logo = req.body.old_clgLogo;
    }

    college.name = name;
    college.address = address;
    college.state = stateId;
    college.city = cityId;
    college.url = url;
    college.facilities = facilities;
    college.pinCode = pinCode;
    college.description = description;
    college.clgLogo = new_logo;
    college.shortName = shortName;
    // college.images = images;

    await college.save();

    req.session.message = {
      type: "success",
      message: "College updated successfully!",
    };
    res.redirect("/allColleges");
    // res.status(200).json({ message: "College updated successfully", college });
  } catch (error) {
    console.error("Error updating college:", error);
    res.status(500).json({ error: "Error updating college" });
  }
};
/** UPDATE COLLEGES ENDS HERE */

/** DELETE COLLEGE START HERE */
const deleteCollege = async (req, res) => {
  try {
    const { id } = req.params;
    // Find the college by ID
    const college = await College.findOneAndRemove({ _id: id });
    // console.log(college);
    if (!college) {
      return res.status(404).json({ error: "College not found" });
    }
    // Delete the corresponding images from the uploads folder
    if (college.clgLogo) {
      const imagePath = "public/" + college.clgLogo;
      // console.log("Image path:", imagePath);
      fs.unlinkSync(imagePath);
    }
    req.session.message = {
      type: "info",
      message: "College Deleted Successfully!",
    };
    res.redirect("/allColleges");
  } catch (error) {
    console.error("Error deleting college:", error);
    req.session.message = {
      type: "danger",
      message: "Error deleting college",
    };
    res.redirect("/allColleges");
    // res.status(500).json({ error: "Error deleting college" });
  }
};
/** DELETE COLLEGE ENDS HERE */

module.exports = {
  homePage,
  topclgPage,
  viewPage,
  adminPage,
  createCollege,
  createCollegeView,
  getAllColleges,
  updateCollege,
  updateCollegeView,
  deleteCollege,
  getCollegeById,
  createImageGalleryView,
  createImageGallery,
  deleteImage,
};
