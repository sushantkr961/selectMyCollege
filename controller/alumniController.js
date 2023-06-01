const Alumni = require("../model/alumniModel");
const College = require("../model/collegeModel");

const viewAlunmi = async (req, res) => {
  const { collegeId } = req.query;
  try {
    const college = await College.findById(collegeId);
    if (!college) {
      return res.status(404).send("College not found");
    }
    const alumni = await Alumni.find({ collegeId });
    res.render("admin/addAlumni", {
      title: "selectmycollege",
      college,
      alumni,
    });
  } catch (err) {
    console.error(err);
    req.session.message = {
      type: "danger",
      message: "Internal Server Error",
    };
    res.status(500).send("Internal Server Error");
  }
};

// const createOrUpdateAlum = async (req, res) => {
//   const { name, batch, package } = req.body;
//   const collegeId = req.query.collegeId;
//   const { id } = req.params;

//   try {
//     let alum;
//     if (id) {
//       // Editing an existing alumni
//       alum = await Alumni.findByIdAndUpdate(
//         id,
//         { name, batch, package },
//         { new: true }
//       );
//     } else {
//       // Creating a new alumni
//       alum = new Alumni({ name, batch, package, college: collegeId });
//       await alum.save();
//     }

//     const college = await College.findById(collegeId);
//     if (!college) {
//       return res.status(404).send("College not found");
//     }

//     const alumni = await Alumni.find({ college: collegeId });

//     res.render("admin/addAlumni", {
//       title: "selectmycollege",
//       college,
//       alumni,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };

const createAlum = async (req, res) => {
  const { name, batch, package } = req.body;
  const collegeId = req.query.collegeId;
  // console.log(collegeId);
  try {
    const alum = await Alumni.create({
      name,
      batch,
      package,
      collegeId,
    });
    req.session.message = {
      type: "success",
      message: "Alum created successfully",
    };
    return res.redirect(`/addColleges/next/alumni?collegeId=${collegeId}`);
    // res.status(201).json({ message: "Alum created successfully", alum });
  } catch (error) {
    console.error(error);
    req.session.message = {
      type: "danger",
      message: "Internal Server Error",
    };
    return res.redirect(`/addColleges/next/alumni?collegeId=${collegeId}`);
    // res.status(500).json({ message: "Internal Server Error" });
  }
};

const deleteAlumni = async (req, res) => {
  const { id, collegeId } = req.params;
  try {
    await Alumni.findByIdAndDelete(id);
    return res.redirect(`/addColleges/next/alumni?collegeId=${collegeId}`);
  } catch (err) {
    console.error(err);
    req.session.message = {
      type: "danger",
      message: "Internal Server Error",
    };
    return res.redirect(`/addColleges/next/alumni?collegeId=${collegeId}`);
    // res.status(500).send("Internal Server Error");
  }
};

const editAlumniView = async (req, res) => {
  const { id } = req.params;

  try {
    const alum = await Alumni.findById(id);

    if (!alum) {
      return res.status(404).send("Alumni not found");
    }

    res.render("admin/editAlumni", {
      title: "Edit Alumni",
      alum,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = {
  viewAlunmi,
  createAlum,
  // createOrUpdateAlum,
  deleteAlumni,
  editAlumniView,
};
