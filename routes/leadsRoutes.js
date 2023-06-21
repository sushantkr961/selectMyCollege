const exprss = require("express");
const controller = require("../controller/leadsController");
const authMiddleware = require("../middleware/authMiddleware");
const router = exprss.Router();

router
  .route("/admin/leads")
  .get(authMiddleware, controller.leadsPage)
  .post(authMiddleware, controller.createLead);

module.exports = router;
