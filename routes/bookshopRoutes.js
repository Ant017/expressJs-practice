const express = require('express')
const routes = express()
const readerValidation = require('../middleware/readerValidation')
const checkLogin = require('../middleware/checkLogin')
const AdminLoginController = require('../controller/adminLoginController')
const readerController = require('../controller/readerController')
const bookController = require("../controller/bookController")
const transactionController = require("../controller/transactionController")

// routes.post("/mongoadd", checkLogin, createValidation.create, readerController.create, readerController.add)
// routes.get("/mongoall", readerController.getAll)
// routes.get("/mongofindbyid/:id", readerController.getOneById)
// routes.delete("/mongodeletebyid/:id", readerController.deleteOneById)
// routes.put("/mongoupbyid/:id", createValidation.create, readerController.create, readerController.updateOneById)

routes.post("/login", AdminLoginController.loginAdmin)

routes.post("/add-book", bookController.add)
routes.get("/get-all-books", bookController.getAll)

routes.post("/add-reader", readerValidation.create, readerController.create, readerController.add)

routes.post("/add-transaction", transactionController.add)
routes.get("/get-transaction", transactionController.getAll)

module.exports = routes