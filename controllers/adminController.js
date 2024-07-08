
const User = require('../models/userModel')
const Category = require('../models/categoryModel')
const Brand = require('../models/brandModel')
const Product = require('../models/productModel')
const bcrypt=require('bcrypt')
const session = require('express-session')
const path = require('path')
const sharp = require('sharp')
const fs = require('fs')



module.exports = {

loadLogin : async (req, res) => {
    try {
        console.log("The admin name IS: "+req.session.adminName)
    if(req.session.adminName){
        res.redirect('/admin/home')
    }
      else{
        const message = req.query.message || '';
        res.render('admin_login', { message: message})
    } 
}
catch (error) {
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
                const passwordMatch=await bcrypt.compare(password,userData.password)
                console.log(passwordMatch)

                if (passwordMatch) {
                    req.session.adminId = userData._id
                    req.session.adminName=userData.name
                    res.redirect('/admin/home')

                } else {
                    res.render('admin_login', { message: 'Invalid password' })
                    
                }
            } else {
                res.render('admin_login', { message: 'Admin not found' })
            }
        } else {
            res.render('admin_login', { message: 'Admin not found' })
        }

    } catch (error) {
        console.log(error.message)
        res.redirect('/500')
    }
},


Logout : async (req, res) => {
    try {
        req.session.destroy()
        res.redirect('/admin')
    } catch (error) {
        console.log(error.message)
        res.redirect('/500')
    }
},



loadDashboard : async (req, res) => {
    try {
        const userCount = await User.find({ is_admin: false }).count()
        const catCount = await Category.find({}).count()
        const brandCount = await Brand.find({}).count()
        const productCount = await Product.find({}).count()
        let admin = req.session.adminName;
        res.render('home',{admin:admin,userCount,catCount,brandCount,productCount})
    } catch (error) {
        res.redirect('/500')
    }
},





}
