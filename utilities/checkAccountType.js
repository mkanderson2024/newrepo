const jwt = require('jsonwebtoken')

function checkAccountType(req, res, next) {
    const token = req.cookies.jwt || req.headers.authorization?.split(' ')[1]

    if(!token){
        req.flash('notice', 'You must be logged in to access this page')
        return res.redirect('/account/login')
    }

    try {
        const accountType = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

        if (accountType.account_type === 'Employee' || accountType.account_type === 'Admin') {
            req.user = accountType
            return next()
        } else {
            req.flash('notice', 'You must be logged in as an employee or admin to access that page.')
            return res.redirect('/account/login')
        }
    }
    catch (err) {
    req.flash('notice', 'Invalid or expired token. Plese log in again.'
    )
    return res.redirect('/account/login')
    }
}

module.exports = checkAccountType 