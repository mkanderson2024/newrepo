const invModel = require("../models/inventory-model")
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */

Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */

Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)


/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li>'
        grid += '<hr />'
        grid += '<div class="inventory-card">'
          grid +=  '<a href="../../inv/detail/' + vehicle.inv_id 
          + '" title="View ' + vehicle.inv_make + ' ' + vehicle.inv_model 
          + ' details"><img src="' + vehicle.inv_thumbnail 
          +'" alt="Image of ' + vehicle.inv_make + ' ' + vehicle.inv_model 
          +' on CSE Motors" /></a>'
          grid += '<div class="namePrice">'
          grid += '<h2>'
            grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
            + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
            + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
          grid += '</h2>'
          grid += '<span>$' 
          + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
          grid += '</div>'
        grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

/* **************************************
* Build the details view HTML
* ************************************ */

Util.buildDetailsView = function(vehicle){
  let view
  view = '<section class="vehicle-description">'
    view += '<div class="description-picture">'
      view += '<img src="' + vehicle.inv_image
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors">'
    view += '</div>'
    view += '<div class="info-card">'
      view += '<span class="description-price">$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      view += '<p>Mileage:' + ' ' + new Intl.NumberFormat('en-US').format(vehicle.inv_miles) + '</p>' + '</div>'
      view += '<section class="details">'
        view += '<h4>Description:</h4>'
        view += '<p>' + vehicle.inv_description + '</p>'
      view += '</section>'
      view += '<section class="description-color">'
        view += '<h4>Color:</h4>'
        view += '<p>' + vehicle.inv_color + '</p>'
      view += '</section>' + '</section>'
  return view
}

Util.buildClassificationDropdown = async function (classification_id = null) {
  let data = await invModel.getClassifications()
  let classificationDropdown =
  '<select name="classification_id" id="vehicle_classification" required>'
  classificationDropdown += "<option value=' '>Choose a Vehicle Classification</option>"
  data.rows.forEach((row) => {
    classificationDropdown += '<option value="' + row.classification_id + '"'
    if(
      classification_id != null &&
      row.classification_id == classification_id
    ){
      classificationDropdown += " Selected "
    }
    classificationDropdown += ">" + row.classification_name + "</option>"
    })
    classificationDropdown += "</select>"
    return classificationDropdown
  }

// Exports
module.exports = Util