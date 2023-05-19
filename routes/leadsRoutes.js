const exprss = require("express");
const controller = require("../controller/leadsController");
const router = exprss.Router();

// leads
router.get("/leads", controller.leadsPage);

module.exports = router;
