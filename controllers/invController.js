const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

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
module.exports = invCont