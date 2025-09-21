const errorController = {}

errorController.triggerError = (req, res, next) => {
    const error = new Error("We've lost all our wheel fasteners this time")
    error.status = 500
    next(error)
}

module.exports = errorController