// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require ("../utilities")
const addInventoryValidate = require("../utilities/vehicle-validation")

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// Route to build details view
router.get("/detail/:inv_id", invController.getVehicleDetailsByVehicleId)

router.get("/management", invController.showVehicleManagement)

router.get("/add-classification", invController.addVehicleClassification)

router.get("/add-inventory", invController.addVehicleToInventory)

// Route to handle adding a new class of vehicle
router.post(
    "/add-classification",
    addInventoryValidate.classificationRules(),
    addInventoryValidate.checkClassificationData,
    utilities.handleErrors(invController.addNewClassification)
)



// Route to handle adding vehicle info to the inventory
router.post(
    "/add-inventory",
    addInventoryValidate.inventoryDataRules(),
    addInventoryValidate.checkVehicleData,
    utilities.handleErrors(invController.addNewInventory)
)

module.exports = router;