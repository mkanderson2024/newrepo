/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/


/* ***********************
 * Require Statements
 *************************/
const express = require("express")
const env = require("dotenv").config()
const app = express()
const expressLayouts = require("express-ejs-layouts")
const static = require("./routes/static")
const baseController = require("./controllers/baseController")
const inventoryRoute = require("./routes/inventoryRoute")
const utilities = require("./utilities/");
const errorRoute = require("./routes/errorRoute")

/* ***********************
 * View Engine abd Templates
 * Routes
 *************************/
app.set("view engine", "ejs")

app.use(expressLayouts)
app.set("layout", "layouts/layout")


// Index Route
app.get("/", utilities.handleErrors(baseController.buildHome))
// Inventory Routes
app.use("/inv", inventoryRoute)

app.use(express.static("public"))

app.use("/errors", errorRoute)

app.use(async (req, res, next) => {
  next({status: 404, message: 'Sorry, we seem to have lost some wheel fasteners there.'})
})



/* ***********************
* Express Error Handler
* Place after all other middleware
*************************/

app.use((err, req, res, next) => {
  (async () => {
  let nav = await utilities.getNav()
  console.error(`Error at: "${req.originalUrl}": ${err.message}`)

  let message
  if(err.status == 404){ message = err.message} else {message = 'Oooohman. Lost all your lugnuts that time....'}


  res.status(err.status|| 500).render("errors/error", {
    title: err.status || 'Server Error',
    message,
    nav
    })
  })()
})

  
/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT
const host = process.env.HOST

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`)
})
