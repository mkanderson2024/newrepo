const utilities = require(".")
const { body, validationResult } = require("express-validator")
const inventoryModel = require("../models/inventory-model")

const validate = {}

/*  **********************************
  *  New Classification Data Validation Rules
  * ********************************* */
 // Declairs the rules of validation

 validate.classificationRules = () => {
    return [
        body("vehicle_class")
        .trim()
        .escape()
        .notEmpty().withMessage("Classification must not be empty")
        .isLength({ min: 1})
        .matches(/^[A-Z][a-z]*$/).withMessage("Capitol letter equired on first letter only. Lowercase only after.")
        .custom(async (vehicle_class) => {
            const classificationExists = await inventoryModel.checkExistingClassification (vehicle_class)
            if (classificationExists){
                throw new Error ("Classification exists. Please create new classification.")
            }
        })
    ]
 }

 /* ******************************
 * Check data and return errors or
 continue to add classification
 * ***************************** */

 validate.checkClassificationData = async (req, res, next) => {
    const {vehicle_class} = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()){
        let nav = await utilities.getNav()
        res.render("./inventory/add-classification", {
        title: "Add Vehicle Classification",
        nav,
        showHero: false,
        showUpgrades: false,
        vehicle_class,
        errors
        })
        return
    }
    next()
 }

/* ******************************
 * Vehicle Inventory Data Validation Rules
 * ***************************** */

validate.inventoryDataRules = () => {
    return[
        //Vehicle Make
        body("vehicle_make")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 1}).withMessage("Please provide the make.")
        .matches(/^[A-Z][a-z]*$/).withMessage("Capitol letter equired on first letter only. Lowercase only after."),

        //Vehicle Model
        body("vehicle_model")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 1}).withMessage("Please provide the model.")
        .matches(/^[A-Z][a-z]*$/).withMessage("Capitol letter equired on first letter only. Lowercase only after."),

        //Vehicle Year
        body("vehicle_year")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 1}).withMessage("Please provide the year.")
        .matches(/^[0-9]{4}$/).withMessage("Capitol letter equired on first letter only. Lowercase only after."),

        //Vehicle Description
        body("vehicle_description")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 1}).withMessage("Please provide Description.")
        .matches(/^[\w\s.,!?-]*$/).withMessage("No symbols other than punctuation are allowed."),

        //Vehicle Image
        body("vehicle_image")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 1}).withMessage("Please provide image name.")
        .matches(/^[A-Za-z?.!]*$/).withMessage("Only letters are allowed."),

        //Vehicle Thumbnail
        body("vehicle_thumbnail")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 1}).withMessage("Please provide thumbnail name.")
        .matches(/^[A-Za-z?.!]*$/).withMessage("Only letters are allowed."),

        //Vehicle Price
        body("vehicle_price")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 1}).withMessage("Please provide the price in numbers only")
        .matches(/^[0-9]+$/).withMessage("No symbols other than punctuation are allowed."),

        //Vehicle Miles
        body("vehicle_miles")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 1}).withMessage("Please provide description")
        .matches(/^[0-9]+$/).withMessage("No symbols other than punctuation are allowed."),

        //Vehicle Color
        body("vehicle_color")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 1}).withMessage("Please provide description")
        .matches(/^[A-Z][a-z]*$/).withMessage("No symbols other than punctuation are allowed."),

        //Vehicle Classification
        body("vehicle_classification")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 1}).withMessage("Please provide description")
        .matches(/^[A-Za-z?.!]*$/).withMessage("No symbols other than punctuation are allowed."),
    ]
}

/* ******************************
 * Check vehicle inventory data and return 
 errors or continue to add classification
 * ***************************** */

validate.checkVehicleData = async function (req, res, next) {
    const { vehicle_make, vehicle_model, vehicle_year, vehicle_description, vehicle_image, vehicle_thumbnail,
            vehicle_price, vehicle_miles, vehicle_color, vehicle_classification } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()){
        let nav = await utilities.getNav()
        res.render("./inventory/add-inventory", {
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
            vehicle_classification
    })
        return
    }
    next()
}


 module.exports = validate