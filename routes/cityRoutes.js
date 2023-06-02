const exprss = require("express");
const controller = require("../controller/cityController");
const router = exprss.Router();

router
  .route("/cities")
  .post(controller.createCity)
  .get(controller.getAllCities);

router
  .route("/cities/:id")
  .put(controller.updateCity)
  .delete(controller.deleteCity)
  .get(controller.getCityById);

module.exports = router;
