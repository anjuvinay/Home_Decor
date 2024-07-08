const express = require('express')
const userRoute = express()
const session = require('express-session')
userRoute.set('view engine', 'ejs')
userRoute.set('views', './views/user')
const userController = require('../controllers/userControllers')
const productController = require('../controllers/productController')
const auth = require('../middlewares/userAuth')






userRoute.get('/',productController.loadHome)

userRoute.get('/signup', userController.loadSignup)
userRoute.post('/signup', userController.checkUniqueEmail, userController.checkUniqueMobile, userController.insertUser)
userRoute.get('/verifyOtp', userController.sendOtp)
userRoute.post('/verifyOtp', userController.verifyOtp)
userRoute.get('/login', userController.loginLoad)
userRoute.post('/login', userController.verifyLogin)
userRoute.get('/logout', userController.userLogout)

userRoute.get('/productDetails',auth.isLogin, auth.isBlocked, productController.productDetails)









module.exports = userRoute