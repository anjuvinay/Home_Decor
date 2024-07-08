const express = require('express')
const adminRoute = express()
const session = require('express-session')
const adminController = require('../controllers/adminController')
const productController = require('../controllers/productController')
const brandController = require('../controllers/brandController')
const categoryController = require('../controllers/categoryController')
const userController = require('../controllers/userControllers')
const auth = require('../middlewares/adminAuth')
const multer = require('multer')
const upload = multer({ dest: 'uploads/' })



adminRoute.set('view engine', 'ejs')
adminRoute.set('views', './views/admin')


adminRoute.get('/', adminController.loadLogin)
adminRoute.post('/', adminController.verifyLogin)
adminRoute.get('/logout', adminController.Logout)


adminRoute.get('/home',auth.isLogin, adminController.loadDashboard)

adminRoute.get('/usersList', auth.isLogin, userController.usersList)
adminRoute.get('/blockUser', auth.isLogin, userController.blockUser)
adminRoute.get('/unblockUser', auth.isLogin, userController.unblockUser)

adminRoute.get('/category', auth.isLogin, categoryController.loadCategories)
adminRoute.post('/category', auth.isLogin, categoryController.checkUniqueCategory, categoryController.addCategories)
adminRoute.get('/editCategory', auth.isLogin, categoryController.editCategory)
adminRoute.post('/editCategory', auth.isLogin, categoryController.checkUniqueCategory, categoryController.loadEditCategory)
adminRoute.get('/deleteCategory', auth.isLogin, categoryController.deleteCategory)

adminRoute.get('/brand', auth.isLogin, brandController.loadBrands)
adminRoute.post('/brand', auth.isLogin, brandController.checkUniqueBrand, brandController.addBrands)
adminRoute.get('/editBrand', auth.isLogin, brandController.editBrand)
adminRoute.post('/editBrand', auth.isLogin, brandController.checkUniqueBrand, brandController.loadEditBrand)
adminRoute.get('/deleteBrand', auth.isLogin, brandController.deleteBrand)

adminRoute.get('/addProduct', auth.isLogin, productController.loadAddProduct)
adminRoute.post('/addProduct', auth.isLogin, upload.array('image', 5), productController.addNewProduct)
adminRoute.get('/productsList', auth.isLogin, productController.productsList)
adminRoute.get('/blockProductList', auth.isLogin, productController.blockProductList)
adminRoute.get('/unBlockProductList', auth.isLogin, productController.unBlockProductList)
adminRoute.get('/deleteProduct', auth.isLogin, productController.deleteProduct)
adminRoute.get('/editProductList', auth.isLogin, upload.array('image', 5), productController.editProductList)
adminRoute.post('/editProductList', auth.isLogin, upload.array('image', 5), productController.loadEditProductList)



















module.exports = adminRoute