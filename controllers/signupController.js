const utilities = require("../utilities")
const signupModel = require("../models/signup-model")

async function buildSignupManagement (req, res, next) {
    try{
        let nav = await utilities.getNav()
        let exsistingEmails = await signupModel.getEmailList()

        let emailList = "<ul>"
        if (exsistingEmails && exsistingEmails.length > 0) {
            exsistingEmails.forEach(element => {
                emailList += `<li>${element.signup_email}</li>`
            })
        } else {
            emailList += "<li>No emails to list yet.</li>"
        }
        emailList += "</ul>"

        res.render("news/signup-management", {
        title: "Newsletter Signup Management",
        nav,
        showHero: false,
        snowUpgrades: false,
        errors: null,
        emailList
    })
    } catch (error) {
        next(error)
    }
}

async function buildSignupForm (req, res, next) {
    let nav = await utilities.getNav()
    res.render("news/signup-form", {
        title: "Newsletter Signup",
        nav,
        showHero: false,
        snowUpgrades: false,
        errors: null,

    })

}

async function addEmail(req, res, next) {
    try {
        const { signup_email } = req.body

        const existing = await signupModel.checkExistingEmail(signup_email)
        if (existing > 0) {
            req.flash("notice", "That email is already signed up.")
            return res.redirect("/news/signup-form")
        }

        const signupResult = await signupModel.addNewEmail(signup_email)

        if (signupResult) {
            req.flash(
                "notice",
                `New email ${signup_email} added to the newsletter list.`
            )
            return res.redirect("/news/signup-management")
        } else {
            req.flash("notice", "Sorry, an error occurred.")
            return res.redirect("/news/signup-form")
        }
    } catch (error) {
        next(error)
    }
}

module.exports = { buildSignupManagement, buildSignupForm, addEmail }