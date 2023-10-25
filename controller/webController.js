const College = require("../model/collegeModel");
const Course = require("../model/courseModel");
const City = require("../model/cityModel");
const Gallery = require("../model/galleryModel");
const Alumni = require("../model/alumniModel");
const Lead = require("../model/leadsModel");
const Fee = require("../model/feeModel");
const collegeTestimonial = require("../model/collegeTestimonialModel");
const Blog = require("../model/blogModel");
const WebsiteTestimonial = require("../model/websiteTestimonialModel");
const FAQ = require("../model/websiteFaqModel");
const FAQc = require("../model/collegeFaqModel");
const Banner = require("../model/bannerModel");
const websiteTestimonial = require("../model/websiteTestimonialModel");

const getBlogById = async (req, res) => {
  const suggestedBlogs = await Blog.find().limit(3);
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      req.session.message = { type: "danger", message: "Blog not found" };
    }
    res.render("blog-single", {
      title: "selectmycollege",
      blog,
      suggestedBlogs,
    });
  } catch (error) {
    req.session.message = { type: "danger", message: "Failed to fetch blog" };
    res.redirect("/blogs");
  }
};

const homePage = async (req, res) => {
  try {
    const [latestBlogs, testimonials, faqs, banners, colleges] =
      await Promise.all([
        Blog.find().sort({ createdAt: -1 }).limit(3),
        websiteTestimonial.find(),
        FAQ.find(),
        Banner.find(),
        College.find().populate("city"),
      ]);

    const collegeCounts = colleges.reduce((countMap, college) => {
      const city = college.city.cityName;
      countMap[city] = (countMap[city] || 0) + 1;
      return countMap;
    }, {});

    res.render("index", {
      latestBlogs,
      testimonials,
      faqs,
      banners,
      colleges,
      collegeCounts,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};

const topclgPage = async (req, res) => {
  const clickedCity = req.query.city || "";
  const clickedCourse = req.query.course || "";
  const searchQuery = req.query.q || "";

  let colleges = [];

  try {
    const [cities, subCourses] = await Promise.all([
      City.find().select("cityName"),
      Course.find({ percouid: { $ne: "0" } }).populate({
        path: "percouid",
        model: "Course",
        select: "name",
      }),
    ]);
    const courses = subCourses.map((subCourse) => {
      if (subCourse.percouid && subCourse.percouid.name) {
        return {
          displayName: `${subCourse.percouid.name} - ${subCourse.name}`,
          value: subCourse.name,
        };
      }
      return {
        displayName: subCourse.name,
        value: subCourse.name,
      };
    });

    if (clickedCity) {
      const cit = await City.findOne({ cityName: clickedCity }, "_id");
      if (cit) {
        colleges = await College.find({ city: cit._id }, "_id name clgLogo")
          .populate("city", "cityName")
          .populate("state", "stateName");
      }
    }

    if (clickedCourse) {
      const mainCourse = await Course.findOne({ name: clickedCourse }, "_id");

      if (mainCourse) {
        const relatedSubCourses = await Course.find(
          {
            percouid: mainCourse._id.toString(),
          },
          "_id"
        );

        const relatedSubCourseIds = relatedSubCourses.map(
          (subCourse) => subCourse._id
        );

        const feess = await Fee.find(
          {
            courseId: { $in: relatedSubCourseIds },
          },
          "collegeId"
        );
        const feeclgIds = feess.map((fee) => fee.collegeId);
        colleges = await College.find({ _id: feeclgIds }, "_id name clgLogo")
          .populate("city", "cityName")
          .populate("state", "stateName");
      }
    }

    res.render("courses", {
      city: clickedCity,
      course: clickedCourse,
      colleges,
      cities,
      courses,
    });
  } catch (error) {
    console.error("Error getting colleges:", error);
    req.session.message = {
      type: "danger",
      message: "Error getting colleges",
    };
    return res.redirect("/");
  }
};

const viewPage = async (req, res) => {
  const collegeId = req.params.collegeId;
  const page = parseInt(req.query.page) || 1;
  const limit = 5;
  const skip = (page - 1) * limit;

  try {
    const college = await College.findById(collegeId).populate("city state");

    if (!college) {
      return res.status(404).json({ message: "College not found" });
    }

    const faqs = await FAQc.find({ collegeId });
    const colleges = await College.find({});
    const fees = await Fee.find({ collegeId: collegeId }).populate("courseId");
    const galleryImages = await Gallery.find({ collegeId: collegeId });
    const testimonials = await collegeTestimonial.find({
      collegeId: collegeId,
    });
    const alumni = await Alumni.find({ collegeId: collegeId })
      .limit(limit)
      .skip(skip);

    const cityId = college.city._id;
    const banners = galleryImages.filter((image) => image.banners === true);
    const totalAlumni = await Alumni.countDocuments({ collegeId: college._id });

    const parentCourseIds = fees.map((fee) => fee.courseId.percouid);
    const parentCourses = await Course.find({ _id: { $in: parentCourseIds } });
    const courseNames = parentCourses.map((course) => course.name);

    const filteredColleges = await College.find({
      city: cityId,
      _id: { $ne: college._id },
    }).populate("city state");
    const totalPages = Math.ceil(totalAlumni / limit);

    const courses = fees.map((fee) => {
      const parentCourse = parentCourses.find(
        (course) => course._id.toString() === fee.courseId.percouid.toString()
      );

      return {
        parentCourse: parentCourse ? parentCourse.name : "Unknown",
        subCourse: fee.courseId.name,
        fee: fee.totalFee,
      };
    });

    res.render("college-single", {
      college,
      colleges,
      gallery: galleryImages,
      banners,
      testimonials,
      alumni,
      courseNames,
      courses,
      filteredColleges,
      currentPage: page,
      totalPages,
      faqs,
    });
  } catch (error) {
    console.error("Error fetching college:", error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error });
  }
};

const getAllColleges = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const perPage = 5;

    const [colleges, totalColleges, cities, subCourses] = await Promise.all([
      College.find({}, "_id name clgLogo")
        .populate("city", "cityName")
        .populate("state", "stateName")
        .skip((page - 1) * perPage)
        .limit(perPage),
      College.countDocuments(),
      City.find({}, "cityName"),
      Course.find({ percouid: { $ne: "0" } }).populate({
        path: "percouid",
        model: "Course",
        select: "name",
      }),
    ]);
    const courses = subCourses.map((subCourse) => {
      if (subCourse.percouid && subCourse.percouid.name) {
        return {
          displayName: `${subCourse.percouid.name} - ${subCourse.name}`,
          value: subCourse.name,
        };
      }
      return {
        displayName: subCourse.name,
        value: subCourse.name,
      };
    });

    // console.log(courses);

    const totalPages = Math.ceil(totalColleges / perPage);

    res.render("colleges", {
      currentPage: page,
      totalPages,
      cities,
      courses,
    });
  } catch (error) {
    console.error("Error getting colleges:", error);
    req.session.message = {
      type: "danger",
      message: "Error getting colleges",
    };
    return res.redirect("/");
  }
};

const fc = async (req, res) => {
  try {
    const cityfil = req.query.city ? req.query.city.split(",") : [];
    const coursefil = req.query.course ? req.query.course.split(",") : [];
    // console.log(coursefil);

    const query = {};

    if (cityfil.length > 0) {
      const cities = await City.find({ cityName: { $in: cityfil } }, "_id");
      const cityIds = cities.map((city) => city._id);
      query.city = { $in: cityIds };
    }

    if (coursefil.length > 0) {
      const corse = await Course.find({ name: { $in: coursefil } }, "_id");
      const corseIds = corse.map((co) => co._id);
      const feess = await Fee.find(
        { courseId: { $in: corseIds } },
        "collegeId"
      );
      const feeclgIds = feess.map((cl) => cl.collegeId);
      query._id = { $in: feeclgIds };
    }

    const colleges = await College.find(query, "_id name clgLogo")
      .populate("city", "cityName")
      .populate("state", "stateName");

    res.render("partials/fc", {
      colleges,
    });
  } catch (error) {
    console.error("Error getting colleges:", error);
    req.session.message = {
      type: "danger",
      message: "Error getting colleges",
    };
    return res.redirect("/");
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
    // req.session.message = {
    //   type: "error",
    //   text: "Submitted Successfully!",
    // };
    // res.status(201).json({ message: "Lead created successfully", lead });
    return res.redirect("/colleges");
  } catch (error) {
    console.error("Error creating lead:", error);
    // res.status(500).json({ error: "Error creating lead" });
    return res.redirect("/colleges");
  }
};

const getAllWebTestimonials = async (req, res) => {
  try {
    const testimonials = await WebsiteTestimonial.find();
    res.render("admin/allWebTestimonial", {
      title: "selectmycollege",
      testimonials,
    });
  } catch (error) {
    console.error("Failed to fetch testimonials:", error);
    req.session.message = {
      type: "danger",
      message: "Failed to fetch testimonials",
    };
    res.redirect("/testimonials");
  }
};

const getsubcourse = async (req, res) => {
  const coursesid = req.params.id;
  const tsc = await Course.find({ percouid: coursesid });
  let aa = `<option>Select Sub Course</option>`;
  if (tsc.length > 0) {
    tsc.map((course) => {
      aa +=
        `<option class="p-3" value="` +
        course._id +
        `">` +
        course.name +
        `</option>`;
    });
  } else {
    aa += `<option>No Sub Course</option>`;
  }
  aa += `<option>Other</option>`;
  return res.json({ haha: aa });
};

module.exports = {
  getBlogById,
  homePage,
  topclgPage,
  viewPage,
  getAllColleges,
  fc,
  createLead,
  getAllWebTestimonials,
  getsubcourse,
};
