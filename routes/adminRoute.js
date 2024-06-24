const express = require('express')
const adminRoute = express()
const session = require('express-session')
const adminController = require('../controllers/adminController')



adminRoute.set('view engine', 'ejs')
adminRoute.set('views', './views/admin')


adminRoute.get('/', adminController.loadLogin)
adminRoute.post('/', adminController.verifyLogin)















module.exports = adminRoute