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
    
    
    
    
}