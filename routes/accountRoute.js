// Needed Resources
const express = require("express")
const router = new express.Router()
const accountController = require("../controllers/accountController")
const utilities = require ("../utilities")
const regValidate = require("../utilities/account-validation")

console.log("registrationRules:", regValidate.registrationRules)
console.log("checkRegData:", regValidate.checkRegData)
console.log("handleErrors:", utilities.handleErrors)
console.log("registerAccount:", accountController.registerAccount)

// Process the registration data
router.post(
    "/register",
    regValidate.registrationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount)
)

// Route to build login view
router.get("/login", utilities.handleErrors(accountController.buildLogin))

router.get("/register", utilities.handleErrors(accountController.buildRegister))

module.exports = router;