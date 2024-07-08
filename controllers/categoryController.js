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
    


}