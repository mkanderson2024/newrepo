const utilities = require("../utilities/")

async function buildLogin(req, res, next) {
    let nav = await utilities.getNav()
    req.flash("notice", "This is a flash message")
    res.render("account/login", {
        title: "Login",
        nav,
        showHero: false,
        showUpgrades: false,
    })
}

async function buildRegister(req, res, next) {
    let nav = await utilities.getNav()
    req.flash("notice", "This is a flash message")
    res.render("account/register", {
        title: "Register",
        nav,
        showHero: false,
        showUpgrades: false,
        errors: null
    })
}

module.exports = { buildLogin, buildRegister }