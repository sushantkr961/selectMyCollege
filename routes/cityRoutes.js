const exprss = require("express");
const controller = require("../controller/cityController");
const router = exprss.Router();

router.post("/cities", controller.createCity);

router.put("/cities/:id", controller.updateCity);

router.delete("/cities/:id", controller.deleteCity);

router.get("/cities", controller.getAllCities);

router.get("/cities/:id", controller.getCityById);

module.exports = router;
