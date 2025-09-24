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
module.exports = buildLogin