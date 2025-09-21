const express = require("express")
const oops = express.Router()
const errorController = require("../controllers/errorController")

oops.get("/trigger-error", errorController.triggerError)

module.exports = oops