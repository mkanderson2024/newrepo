const express = require("express")
const router = new express.Router()
const signupController = require ("../controllers/signupController")
const utilities = require ("../utilities")
const signupValidate = require("../utilities/signup-validation")

router.get("/signup-management",
    utilities.handleErrors(signupController.buildSignupManagement)
)

router.get("/signup-form",
    utilities.handleErrors(signupController.buildSignupForm)
)
router.post("/signup-form",
    signupValidate.signupRules(),
    signupValidate.checkSignupData,
    utilities.handleErrors(signupController.addEmail)
)

module.exports = router