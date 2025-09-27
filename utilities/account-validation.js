const utilities = require(".")
const { body, validationResult} = require("express-validator")
const accountModel = require("../models/account-model")

const validate =  {}

/*  **********************************
  *  Registration Data Validation Rules
  * ********************************* */
 // Declairs the rules of validation

validate.registrationRules = () => {
    return [
    // First Name required and must be a string
    body("account_firstname")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 1})
        .withMessage("Please provide a first name."), //Displays this message on error

    // Last Name required and must be a string
    body("account_lastname")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 2 })
        .withMessage("Please provide a last name."), // Displays this message on error

    // Valid email is required and cannot already exist in the data base
    body("account_email")
        .trim()
        .escape()
        .notEmpty()
        .isEmail()
        .normalizeEmail()
        .withMessage("A valid email is required.")
        .custom(async (account_email) => {
            const emailExists = await accountModel.checkExistingEmail (account_email)
            if (emailExists){
                throw new Error ("Email exists. Please log in or use different email")
            }
        }),
    
    // Passsword is required and must be a strong password
    body("account_password")
        .trim()
        .notEmpty()
        .isStrongPassword({
            minLength: 12,
            minLowercase: 1,
            minUpperCase: 1,
            minNumbers: 1,
            minNumbers: 1,
            minSymbols: 1,
        })
        .withMessage("Password does not meet requirements.")
    ]
}

/* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */

validate.checkRegData = async (req, res, next) => {
    const { account_firstname, account_lastname, account_email} = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()){
        let nav = await utilities.getNav()
        res.render("account/register", {
            errors,
            title: "Registration",
            nav,
            showHero: false,
            showUpgrades: false,
            account_firstname,
            account_lastname,
            account_email,
        })
        return
    }
    next()
}

/* ******************************
 * Login Data Validation Rules
 * ***************************** */
validate.loginRules = () => {
    return[
        body("account_email")
        .trim()
        .escape()
        .notEmpty()
        .isEmail()
        .normalizeEmail()
        .withMessage("A valid email is required.")
        .custom(async (account_email) => {
            const emailExists = await accountModel.checkExisitingEmail (account_email)
            if (!emailExists){
                throw new Error ("Email not found. Please check email or register.")
            }
        }),
    ]
}

/* ******************************
 * Check Login Data
 * ***************************** */

validate.checkLoginData = async (req, res, next) => {
    const { account_email } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()){
        let nav = await utilities.getNav()
        res.render("account/login", {
            errors,
            title: "Registration",
            nav,
            showHero: false,
            showUpgrades: false,
            account_email,
        })
        return
    }
    next()
}

module.exports = validate