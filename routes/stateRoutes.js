const exprss = require("express");
const controller = require("../controller/stateController");
const router = exprss.Router();

router
  .route("/states")
  .post(controller.createState)
  .get(controller.getAllStates);

router
  .route("/states/:id")
  .put(controller.updateState)
  .delete(controller.deleteState)
  .get(controller.getStateById);

module.exports = router;
