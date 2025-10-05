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

  let nav = await utilities.getNav()

  if (!data || data.length === 0) {
    req.flash("notice", "Sorry, no vehicles were found for this classification.")
    return res.status(404).render("./inventory/classification", {
      title: "No Vehicles Found",
      nav,
      grid: "<p>No vehicles available in this category.</p>",
      showHero: false,
      showUpgrades: false
    })
  }

  const grid = await utilities.buildClassificationGrid(data)
  const className = data[0].classification_name

  res.render("./inventory/classification", {
    title: className + " Vehicles",
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
 *  Build The Vehicle Management View
 * ************************** */
invCont.showVehicleManagement = async function (req, res, next) {
  try {
    let nav = await utilities.getNav()
    const classificationDropdown = await utilities.buildClassificationDropdown()
    res.render("./inventory/management", {
      title: "Vehicle Management",
      nav,
      classificationDropdown,
      showHero: false,
      showUpgrades: false,
      errors: null
    })
  } catch (error) {
    console.error("showVehicleManagement error:", error)
    next(error)
  }
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

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

/* ***************************
 *  Build edit inventory view
 * ************************** */
invCont.editInventoryView = async function (req, res, next) {
  try{
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()
  const itemData = await invModel.getVehicleDetailsByVehicleId(inv_id)
  const classificationSelect = await utilities.buildClassificationList(itemData.classification_id)
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
  res.render("./inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    vehicle_make: itemData.inv_make,
    vehicle_id: itemData.inv_id,
    vehicle_model: itemData.inv_model,
    vehicle_year: itemData.inv_year,
    vehicle_description: itemData.inv_description,
    vehicle_image: itemData.inv_image,
    vehicle_thumbnail: itemData.inv_thumbnail,
    vehicle_price: itemData.inv_price,
    vehicle_miles: itemData.inv_miles,
    vehicle_color: itemData.inv_color,
  })
} catch (error) {
  console.error("editInventoryView error:", error)
  next(error)
}
}

/* ***************************
 *  Update Inventory Data
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body
  const updateResult = await invModel.updateInventory(
    inv_id,  
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  )

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model
    req.flash("notice", `The ${itemName} was successfully updated.`)
    res.redirect("/inv/management")
  } else {
    const classificationSelect = await utilities.buildClassificationList(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the insert failed.")
    res.status(501).render("inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: [],
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
    })
  }
}

/* ***************************
 *  Build delete inventory view
 * ************************** */
invCont.deleteInventoryView = async function (req, res, next) {
  try{
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()
  const itemData = await invModel.getVehicleDetailsByVehicleId(inv_id)
  const classificationSelect = await utilities.buildClassificationList(itemData.classification_id)
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
  res.render("./inventory/delete-confirmation", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id: itemData.inv_id,
    vehicle_make: itemData.inv_make,
    vehicle_model: itemData.inv_model,
    vehicle_year: itemData.inv_year,
    vehicle_price: itemData.inv_price,
  })
} catch (error) {
  console.error("editInventoryView error:", error)
  next(error)
}
}

/* ***************************
 *  Delete Inventory Data
 * ************************** */
invCont.deleteInventory = async function (req, res, next) {
  try {
    let nav = await utilities.getNav()
    const { inv_id, inv_make, inv_model, inv_price, inv_year, classification_id } = req.body

    const deleteResult = await invModel.deleteInventory(inv_id)

    if (deleteResult.rowCount > 0) {
      const itemName = `${inv_make} ${inv_model}`
      req.flash("notice", `The ${itemName} was successfully deleted.`)
      res.redirect("/inv/management")
    } else {
      const classificationSelect = await utilities.buildClassificationList(classification_id)
      const itemName = `${inv_make} ${inv_model}`
      req.flash("notice", "Sorry, the delete failed.")
      res.status(501).render("inventory/management", {
        title: "Delete " + itemName,
        nav,
        classificationSelect: classificationSelect,
        errors: [],
        inv_id,
        vehicle_make: inv_make,
        vehicle_model: inv_model,
        vehicle_year: inv_year,
        vehicle_price: inv_price,
        classification_id,
      })
    }
  } catch (error) {
    console.error("deleteInventory controller error:", error)
    next(error)
  }
}


module.exports = invCont

