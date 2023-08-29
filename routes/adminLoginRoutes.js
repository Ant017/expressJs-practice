const express = require('express')
const routes = express()
const AdminLoginController = require('../controller/adminLoginController')
// const createValidation = require('../middleware/validation')


routes.post("/adminlogin", AdminLoginController.loginAdmin)

module.exports = routes