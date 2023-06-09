const fs = require("fs");
const imageSize = require("image-size");
const College = require("../model/collegeModel");
const Course = require("../model/courseModel");
const City = require("../model/cityModel");
const State = require("../model/stateModel");
const Gallery = require("../model/galleryModel");
const Alumni = require("../model/alumniModel");
const Lead = require("../model/leadsModel");
const Fee = require("../model/feeModel");
const { log } = require("console");

// index page
const homePage = async (req, res) => {
  const cities = City.find();
  res.render("index", { title: "selectmycollege" });
};

const topclgPage = async (req, res) => {
  const clickedCity = req.query.city;
  try {
    const city = await City.findOne({ cityName: clickedCity });
    if (!city) {
      console.error("City not found");
      return res.status(404).json({ error: "City not found" });
    }
    const cityId = city._id;
    const filteredColleges = await College.find({ city: cityId }).populate("city");
    
    const tcdPromises = filteredColleges.map(async (college) => {
      const collegeId = college._id;
      const fees = await Fee.find({ collegeId });
      const collegePromises = fees.map(async (sfee) => {
        const courseId = sfee.courseId;
        const course = await Course.findById(courseId);
        const totalfee = 1000;
        return {
          college_name: college.name,
          college_sname: college.shortName,
          college_logo: college.clgLogo,
          college_city: college.city.cityName,
          college_address: college.address,
          course_name: course.name,
          coursefee: totalfee,
        };
      });
      return Promise.all(collegePromises);
    });
    
    const tcd = await Promise.all(tcdPromises);
    const flattenedTcd = [].concat(...tcd);
    
    res.render("topclg", {
      title: "selectmycollege",
      city: clickedCity,
      colleges: flattenedTcd,
    });
  } catch (error) {
    console.error("Error fetching colleges:", error);
    res.status(500).json({ error: "Error fetching colleges" });
  }
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
    const leadsCount = await Lead.countDocuments();

    res.render("admin/dashboard", {
      title: "selectmycollege Admin",
      collegeCount,
      courseCount,
      alumniCount,
      leadsCount,
    });
  } catch (error) {
    console.error("Error getting count:", error);
    req.session.message = {
      type: "warning",
      message: "Error getting count",
    };
    return res.redirect("/admin");
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
    req.session.message = {
      type: "danger",
      message: "Error retrieving cities.",
    };
    return res.redirect("/admin/addCollege");
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
      return res.redirect("/admin/addColleges");
    }

    const collegeExists = await College.findOne({ name });
    if (collegeExists) {
      req.session.message = {
        type: "warning",
        message: "College already exists",
      };
      return res.redirect("/admin/addColleges");
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
    return res.redirect(`/admin/addColleges/next?collegeId=${college._id}`);
  } catch (error) {
    console.error("Error creating college:", error);
    req.session.message = {
      type: "danger",
      message: "Error creating college.",
    };
    return res.redirect("/admin/addColleges");
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
    req.session.message = {
      type: "danger",
      message: "Internal Server Error",
    };
    return res.redirect("admin/addImageGallery");
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
    // Perform validation only if the checkbox is checked
    if (banners === "true") {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const dimensions = imageSize(file.path);

        // Example validation: Check if resolution is less than 1920x1080
        const maxWidth = 1920;
        const maxHeight = 1080;
        if (dimensions.width > maxWidth || dimensions.height > maxHeight) {
          // Delete the uploaded file
          fs.unlinkSync(file.path);
          req.session.message = {
            type: "danger",
            message:
              "Invalid image resolution. Please select an image with a maximum resolution of 1920x1080.",
          };
          return res.redirect(
            `/admin/addColleges/next/gallery?collegeId=${collegeId}`
          );
        }

        // Example validation: Check if file size is greater than 2MB
        const maxSize = 2 * 1024 * 1024; // 2MB in bytes
        if (file.size > maxSize) {
          // Delete the uploaded file
          fs.unlinkSync(file.path);
          req.session.message = {
            type: "danger",
            message:
              "Invalid file size. Please select an image with a maximum size of 2MB.",
          };
          return res.redirect(
            `/admin/addColleges/next/gallery?collegeId=${collegeId}`
          );
        }
      }
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
    res.redirect(`/admin/addColleges/next/gallery?collegeId=${collegeId}`);
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
        type: "danger",
        message: "Image not found",
      };
      return res.redirect(
        `/admin/addColleges/next/gallery?collegeId=${collegeId}`
      );
    }
    fs.unlinkSync("public/" + deletedImage.image);
    res.redirect(`/admin/addColleges/next/gallery?collegeId=${collegeId}`);
  } catch (err) {
    console.error(err);
    req.session.message = {
      type: "danger",
      message: "Internal Server Error",
    };
    res.redirect(`/admin/addColleges/next/gallery?collegeId=${collegeId}`);
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
    req.session.message = {
      type: "danger",
      message: "Error getting colleges",
    };
    return res.redirect("/allColleges");
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
      type: "success",
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
