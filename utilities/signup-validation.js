const utilities = require(".")
const { body, validationResult} = require("express-validator")
const signupModel = require("../models/signup-model")

const validate = {}

/*  **********************************
  *  Registration Data Validation Rules
  * ********************************* */
 // Declaires the rules of validation

 validate.signupRules = () => {
    return [
    body("signup_email")
         .trim()
         .notEmpty()
         .withMessage("Please enter an email.")
         .isEmail()
         .withMessage("A valid email is required.")
         .normalizeEmail()
         .custom(async (signup_email) => {
             const emailExists = await signupModel.checkExistingEmail (signup_email)
             if (emailExists){
                 throw new Error ("Email exists. Please enter a different email")
             }
         })
        ]
    }

    validate.checkSignupData = async (req, res, next) => {
        const { signup_email } = req.body
        let errors = []
        errors = validationResult(req)
        if (!errors.isEmpty()){
            let nav = await utilities.getNav()
            res.render("news/signup-form", {
                errors,
                title: "Newsletter Signup",
                nav,
                showHero: false,
                snowUpgrades: false,
                signup_email,
            })
            return
        }
        next()
    }
module.exports = validate