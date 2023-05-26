const exprss = require("express");
const controller = require("../controller/feeController");
const router = exprss.Router();

router.post("/fee", controller.createFeeStructure);
router.get("/fee", (req, res) => {
  res.json("fee structure");
});

module.exports = router;