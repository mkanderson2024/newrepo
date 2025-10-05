// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require ("../utilities")
const addInventoryValidate = require("../utilities/vehicle-validation")
const updateInventoryValidate = require("../utilities/vehicle-validation")
const checkAccountType = require("../utilities/checkAccountType")

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// Route to build details view
router.get("/detail/:inv_id", invController.getVehicleDetailsByVehicleId)

router.get("/management", checkAccountType, invController.showVehicleManagement)

router.get("/add-classification", checkAccountType, invController.addVehicleClassification)

router.get("/add-inventory", checkAccountType, invController.addVehicleToInventory)

// Route to handle adding a new class of vehicle
router.post(
    "/add-classification",
    checkAccountType,
    addInventoryValidate.classificationRules(),
    addInventoryValidate.checkClassificationData,
    utilities.handleErrors(invController.addNewClassification)
)

// Route to handle adding vehicle info to the inventory
router.post(
    "/add-inventory",
    checkAccountType,
    addInventoryValidate.inventoryDataRules(),
    addInventoryValidate.checkVehicleData,
    utilities.handleErrors(invController.addNewInventory)
)

router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))

router.get("/edit/:inv_id",
    checkAccountType,
    invController.editInventoryView)

router.post("/update/",
    checkAccountType,
    updateInventoryValidate.inventoryDataRules(),
    updateInventoryValidate.checkVehicleUpdateData,
    utilities.handleErrors(invController.updateInventory)
)

router.get("/delete/:inv_id",
    checkAccountType,
    invController.deleteInventoryView)

router.post("/delete",
    checkAccountType,
    utilities.handleErrors(invController.deleteInventory)
)

module.exports = router;