
const User = require('../models/userModel')
const Category = require('../models/categoryModel')
const Brand = require('../models/brandModel')
const Product = require('../models/productModel')
const bcrypt=require('bcrypt')
const adminLayout = "./layouts/adminLayout.ejs";
const session = require('express-session')



module.exports = {

loadLogin : async (req, res) => {
    try {
        res.render('admin_login', { message: '' })
    } catch (error) {
        console.log(error.message)
        res.redirect('/500')
    }
},



verifyLogin : async (req, res) => {
    try {
        const { email } = req.body
        const { password } = req.body
        const userData = await User.findOne({ email: email })
        console.log(userData)
        if (userData) {
            if (userData.is_admin === true) {
                console.log(userData.password)
                console.log(password)
                const passwordMatch=await bcrypt.compare(password,userData.password)
                console.log(passwordMatch)
                if (passwordMatch) {
                    req.session.adminId = userData._id
                    req.session.adminName=userData.name
                    // console.log(req.session.adminId)
                    res.redirect('/admin/home')
                } else {
                    res.render('login', { message: 'Invalid password' })
                }
            } else {
                res.render('login', { message: 'Admin not found' })
            }
        } else {
            res.render('login', { message: 'Admin not found' })
        }

    } catch (error) {
        console.log(error.message)
        res.redirect('/500')
    }
},



loadDashboard : async (req, res) => {
    try {
        let admin = req.session.adminName;
        res.render('home',{admin:admin})
    } catch (error) {
        res.redirect('/500')
    }
},



usersList : async (req, res) => {
    try {
        const userData = await User.find({ is_admin: false })
        let admin = req.session.adminName;
        res.render('userList', { users: userData, admin:admin })
    } catch (error) {
        console.log(error.message)
        res.redirect('/500')
    }
    
},



blockUser : async (req, res) => {
    try {
        const id = req.query.id
        const userData = await User.findByIdAndUpdate({ _id: id }, { $set: { is_active: false } })
        if (userData) {
            res.redirect('/admin/usersList')
        }

    } catch (error) {
        console.log(error.message)
        res.redirect('/500')
    }
},



unblockUser : async (req, res) => {
    try {
        const id = req.query.id
        const userData = await User.findByIdAndUpdate({ _id: id }, { $set: { is_active: true } })
        if (userData) {
            res.redirect('/admin/usersList')
        }

    } catch (error) {
        console.log(error.message)
        res.redirect('/500')
    }
},



checkUniqueCategory : async (req, res, next) => {
    const { categoryName } = req.body;
    let admin = req.session.adminName;
    try {
        const existingCategory = await Category.findOne({ categoryName: categoryName });
        console.log(existingCategory);
        if (existingCategory) {
            const categoryData = await Category.find({})
            res.render('category', { message: 'category already exists', category: categoryData, admin:admin})
        } else {
            next();
        }
    } catch (err) {
        console.log(err.message)
        res.redirect('/500')
        // return res.status(500).json({ error: 'Database error' });
    }
},


addCategories : async (req, res) => {
    try {
        const category = new Category({
            categoryName: req.body.categoryName.trim()
        })
        const userData = await category.save()
        if (userData) {
            res.redirect('/admin/category')
        }
    } catch (error) {
        console.log(error.message)
        res.redirect('/500')
    }
},


loadCategories : async (req, res) => {
    try {
        const userData = await Category.find({})
        let admin = req.session.adminName;
        if (userData) {
            res.render('category', { category: userData, admin:admin })
        }
    } catch (error) {
        console.log(error.message)
        res.redirect('/500')
    }
},



 editCategory : async (req, res) => {
    try {
        const id = req.query.id
        const userData = await Category.findById({ _id: id })
        let admin = req.session.adminName;
        if (userData) {
            res.render('editCategory', { category: userData ,admin:admin})
        }
    } catch (error) {
        console.log(error.message)
        res.redirect('/500')
    }
},


loadEditCategory : async (req, res) => {
    try {
        const id = req.query.id
        const userData = await Category.findByIdAndUpdate({ _id: id }, { $set: { categoryName: req.body.categoryName } })
        await userData.save()
        if (userData) {
            res.redirect('/admin/category')
        }
    } catch (error) {
        console.log(error.message)
        res.redirect('/500')
    }
},


deleteCategory : async (req, res) => {
    try {
        const id = req.query.id
        const userData = await Category.deleteOne({ _id: id })
        if (userData) {
            res.redirect('/admin/category')
        }
    } catch (error) {
        console.log(error.message)
        res.redirect('/500')
    }
},



checkUniqueBrand : async (req, res, next) => {
    const { brandName } = req.body;
    let admin = req.session.adminName;
    try {
        const existingBrand = await Brand.findOne({ brandName: brandName });
        console.log(existingBrand);
        if (existingBrand) {
            const brandData = await Brand.find({})
            res.render('brand', { message: 'brand already exists', brand: brandData, admin:admin})
        } else {
            next();
        }
    } catch (err) {
        console.log(err.message)
        res.redirect('/500')
        // return res.status(500).json({ error: 'Database error' });
    }
},


addBrands : async (req, res) => {
    try {
        const brand = new Brand({
            brandName: req.body.brandName.trim()
        })
        const userData = await brand.save()
        if (userData) {
            res.redirect('/admin/brand')
        }
    } catch (error) {
        console.log(error.message)
        res.redirect('/500')
    }
},


loadBrands : async (req, res) => {
    try {
        const userData = await Brand.find({})
        let admin = req.session.adminName;
        if (userData) {
            res.render('brand', { brand: userData, admin:admin })
        }
    } catch (error) {
        console.log(error.message)
        res.redirect('/500')
    }
},


editBrand : async (req, res) => {
    try {
        const id = req.query.id
        const userData = await Brand.findById({ _id: id })
        let admin = req.session.adminName;
        if (userData) {
            res.render('editBrand', { brand: userData ,admin:admin})
        }
    } catch (error) {
        console.log(error.message)
        res.redirect('/500')
    }
},


loadEditBrand : async (req, res) => {
    try {
        const id = req.query.id
        const userData = await Brand.findByIdAndUpdate({ _id: id }, { $set: { brandName: req.body.brandName } })
        await userData.save()
        if (userData) {
            res.redirect('/admin/brand')
        }
    } catch (error) {
        console.log(error.message)
        res.redirect('/500')
    }
},


deleteBrand : async (req, res) => {
    try {
        const id = req.query.id
        const userData = await Brand.deleteOne({ _id: id })
        if (userData) {
            res.redirect('/admin/brand')
        }
    } catch (error) {
        console.log(error.message)
        res.redirect('/500')
    }
},



loadAddProduct : async (req, res) => {
    try {
        let admin = req.session.adminName;
        const categoryData = await Category.find({ is_active: true })
        // const brandData = await Brand.find({ is_active: true })
        // res.render('addproduct', { category: categoryData, brand: brandData })
        res.render('addproduct', { category: categoryData, admin:admin})
    } catch (error) {
        console.log(error.message)
        res.redirect('/500')
    }
},



addNewProduct : async (req, res) => {
  console.log(req.body.title)
}



}
