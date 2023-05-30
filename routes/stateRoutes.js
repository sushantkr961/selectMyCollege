const exprss = require("express");
const controller = require("../controller/stateController");
const router = exprss.Router();

router.post("/states", controller.createState);

router.put("/states/:id", controller.updateState);

router.delete("/states/:id", controller.deleteState);

router.get("/states", controller.getAllStates);

router.get("/states/:id", controller.getStateById);

module.exports = router;
