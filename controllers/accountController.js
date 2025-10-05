const utilities = require("../utilities/")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()

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

/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
    let nav = await utilities.getNav()
    const { account_firstname, account_lastname, account_email, account_password } = req.body
    // Hash the password before storing
    let hashedPassword
    try {
        // regular password and cost (salt is generated automatically)
        hashedPassword = await bcrypt.hashSync(account_password, 10)
    } catch (error) {
        req.flash("notice", 'Sorry, there was an error processing the registration.')
        res.status(500).render("account/register", {
            title: "Registration",
            nav,
            showHero: false,
            showUpgrades: false,
        })
    }

    const regResult = await accountModel.registerAccount(
            account_firstname,
            account_lastname,
            account_email,
            hashedPassword
    )

    if (regResult) {
        req.flash(
            "notice",
            `Congratulations, you\'re registered ${account_firstname}. Please log in.`
        )
        res.status(201).render("account/login", {
            title: "Login",
            nav,
            showHero: false,
            showUpgrades: false,
        })
    } else {
            req.flash("notice", "Sorry, the registration failed.")
            res.status(501).render("account/register", {
            title: "Registration",
            nav,
            showHero: false,
            showUpgrades: false,
        })
    }
}

/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
    console.log("Router to Login Hit")
    let nav = await utilities.getNav()
    const { account_email, account_password } = req.body
    const accountData = await accountModel.getAccountByEmail(account_email)
    if (!accountData) {
        req.flash("notice", "Please check your credentials and try again.")
        res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
        })
        return
    }
    try {
        if (await bcrypt.compare(account_password, accountData.account_password)) {
        delete accountData.account_password

        const payload = {
            account_id: accountData.account_id,
            account_type: accountData.account_type,
            account_email: accountData.account_email
        }
        const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
        if(process.env.NODE_ENV === 'development') {
            res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
            console.log("Process attempted")
        } else {
            res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
        }
        return res.redirect("/")
        }
        else {
        console.log("Login didn't work.")
        req.flash("notice", "Please check your credentials and try again.")
        res.status(400).render("account/login", {
            title: "Login",
            nav,
            errors: null,
            account_email,
        })
        }
    } catch (error) {
        throw new Error('Access Forbidden')
    }
}

module.exports = { buildLogin, buildRegister, registerAccount, accountLogin }