const express = require('express')
const adminRoute = express()
const session = require('express-session')
const adminController = require('../controllers/adminController')
const auth = require('../middlewares/adminAuth')
const multer = require('multer')
const upload = multer({ dest: 'uploads/' })



adminRoute.set('view engine', 'ejs')
adminRoute.set('views', './views/admin')


adminRoute.get('/', adminController.loadLogin)
adminRoute.post('/', adminController.verifyLogin)

adminRoute.get('/home',auth.isLogin, adminController.loadDashboard)

adminRoute.get('/usersList', auth.isLogin, adminController.usersList)
adminRoute.get('/blockUser', auth.isLogin, adminController.blockUser)
adminRoute.get('/unblockUser', auth.isLogin, adminController.unblockUser)

adminRoute.get('/category', auth.isLogin, adminController.loadCategories)
adminRoute.post('/category', auth.isLogin, adminController.checkUniqueCategory, adminController.addCategories)
adminRoute.get('/editCategory', auth.isLogin, adminController.editCategory)
adminRoute.post('/editCategory', auth.isLogin, adminController.checkUniqueCategory, adminController.loadEditCategory)
adminRoute.get('/deleteCategory', auth.isLogin, adminController.deleteCategory)

adminRoute.get('/brand', auth.isLogin, adminController.loadBrands)
adminRoute.post('/brand', auth.isLogin, adminController.checkUniqueBrand, adminController.addBrands)
adminRoute.get('/editBrand', auth.isLogin, adminController.editBrand)
adminRoute.post('/editBrand', auth.isLogin, adminController.checkUniqueBrand, adminController.loadEditBrand)
adminRoute.get('/deleteBrand', auth.isLogin, adminController.deleteBrand)

adminRoute.get('/addProduct', auth.isLogin, adminController.loadAddProduct)
// adminRoute.post('/addProduct', auth.isLogin, upload.array('image', 5), adminController.addNewProduct)
adminRoute.post('/addProduct', auth.isLogin, adminController.addNewProduct)

















module.exports = adminRoute