const exprss = require("express");
const controller = require("../controller/leadsController");
const router = exprss.Router();

router.get("/leads", controller.leadsPage);
router.post("/leads", controller.createLead);

module.exports = router;
