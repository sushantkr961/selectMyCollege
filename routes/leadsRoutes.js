const exprss = require("express");
const controller = require("../controller/leadsController");
const router = exprss.Router();

router.route("/admin/leads")
    .get(controller.leadsPage)
    .post(controller.createLead);

module.exports = router;
