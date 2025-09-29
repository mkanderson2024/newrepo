const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")
const inventoryModel = require("../models/inventory-model")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
    const classification_id = req.params.classificationId
    const data = await invModel.getInventoryByClassificationId(classification_id)
    const grid = await utilities.buildClassificationGrid(data)
    let nav = await utilities.getNav()
    const className = data[0].classification_name
    res.render("./inventory/classification", {
      title: className + " Vehicles ",
      nav,
      grid,
      showHero: false,
      showUpgrades: false
  })
}


/* ***************************
 *  Build details by vehicle id view
 * ************************** */
invCont.getVehicleDetailsByVehicleId = async function (req, res, next) {
    const invId = req.params.inv_id
    const data = await invModel.getVehicleDetailsByVehicleId(invId)

    let nav = await utilities.getNav()
    const vehicleDetails = utilities.buildDetailsView(data)
  res.render("./inventory/details", {
    title: `${data.inv_year} ${data.inv_make} ${data.inv_model}`,
    nav,
    vehicleDetails,
    showHero: false,
    showUpgrades: false
  })
}

/* ***************************
 *  Build details by vehicle id view
 * ************************** */
invCont.showVehicleManagement = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("./inventory/management", {
    title: "Vehicle Management",
    nav,
    showHero: false,
    showUpgrades: false,
    errors: null
  })
}

/* ***************************
 * Add classification of vehicle
 * ************************** */
invCont.addVehicleClassification = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("./inventory/add-classification", {
    title: "Add Vehicle Classification",
    nav,
    showHero: false,
    showUpgrades: false,
    errors: null
  })
}

/* ***************************
 *  Add vehicle to inventory
 * ************************** */
invCont.addVehicleToInventory = async function (req, res, next) {
  try{
  let nav = await utilities.getNav()
  const classificationDropdown = await utilities.buildClassificationDropdown()
  res.render("./inventory/add-inventory", {
    title: "Add Vehicle To Inventory",
    nav,
    showHero: false,
    showUpgrades: false,
    classificationDropdown,
    errors: null
    
  })
} catch (error) {
  console.error("addVehicleToInventory error: " + error)
  next(error)
}
}

/* ****************************************
*  Process New Vehicle Data
* *************************************** */

invCont.addNewInventory = async function (req, res) {
    let nav = await utilities.getNav()
    const { vehicle_make, vehicle_model, vehicle_year, vehicle_description, vehicle_image, vehicle_thumbnail,
            vehicle_price, vehicle_miles, vehicle_color, vehicle_classification } = req.body
    try {
      const inventoryResult = await inventoryModel.addNewInventory(
            vehicle_make,
            vehicle_model,
            vehicle_year,
            vehicle_description,
            vehicle_image,
            vehicle_thumbnail,
            vehicle_price,
            vehicle_miles,
            vehicle_color,
            vehicle_classification
      )
    if (inventoryResult.rowCount > 0) {
        req.flash(
            "notice",
            `New vehicle succesffully added.`)
            return res.redirect("inv/add-inventory")
    } else {
            req.flash("notice", "Sorry, adding the vehicle failed.")
            res.status(501).render("inventory/add-inventory", {
            title: "Add Vehicle To Inventory",
            nav,
            showHero: false,
            showUpgrades: false,
            vehicle_make,
            vehicle_model,
            vehicle_year,
            vehicle_description,
            vehicle_image,
            vehicle_thumbnail,
            vehicle_price,
            vehicle_miles,
            vehicle_color,
            errors: []
        })
       }
      }          
    catch (error) {
      console.error("addNewInventory controller error:", error)
      req.flash("notice", "Error occured while trying to add to inventory.")
      return res.status(500).render("inv/add-inventory", {
        title: "Add Vehicle To Inventory",
        nav,
        showHero: false,
        showUpgrades: false,
        errors: [{msg: "Database error. Please try again."}]
      })
    }

}

/* ****************************************
*  Process Adding a New Vehicle Classification
* *************************************** */

invCont.addNewClassification = async (req, res, next) => {
  const { vehicle_class } = req.body;

  try {
    const newClassAdditionResult = await inventoryModel.addNewClass(vehicle_class);

    let nav = await utilities.getNav();

    if (newClassAdditionResult) {
      req.flash(
        "notice",
        `The new class of vehicle ${vehicle_class} has been successfully added.`
      );
      res.status(201).render("inventory/management", {
        title: "Inventory Management",
        nav,
        showHero: false,
        showUpgrades: false,
      });
    } else {
      req.flash("notice", "Sorry, adding the vehicle failed.");
      res.status(501).render("inv/add-classification", {
        title: "Add Vehicle Classification",
        nav,
        showHero: false,
        showUpgrades: false,
        vehicle_class,
        errors: null
      });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = invCont

