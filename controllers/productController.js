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

    loadAddProduct : async (req, res) => {
        try {
            let admin = req.session.adminName;
            const categoryData = await Category.find({ is_active: true })
            const brandData = await Brand.find({ is_active: true })
            res.render('addproduct', { category: categoryData, brand: brandData, admin:admin })
            
        } catch (error) {
            console.log(error.message)
            res.redirect('/500')
        }
    },
    
    
    
    addNewProduct : async (req, res) => {
        try {
            let salePrice;
            if (req.body.discountPercentage.trim() > 0) {
                salePrice = req.body.regularPrice - (req.body.regularPrice.trim() * req.body.discountPercentage / 100);
            } else {
                salePrice = req.body.regularPrice.trim();
            }
    
            const imagePromises = req.files.map(async (file) => {
                const imagePath = `uploads/${file.filename}`;
                const resizedImagePath = `uploads/resized_${file.filename}`;
                await sharp(imagePath)
                    .resize({ width: 400, height: 400 })
                    .toFile(resizedImagePath);
    
    
                    //Remove the original uploaded image
                    fs.unlink(imagePath, (err) => {
                        if (err) {
                            console.error('Failed to delete original image', err);
                        } else {
                            console.log('Original image deleted successfully');
                        }
                    });
    
                return resizedImagePath;
            });
    
            const resizedImageUrls = await Promise.all(imagePromises);
    
    
    
            const productData = {
                title: req.body.title.trim(),
                material: req.body.material.trim(),
                color: req.body.color.trim(),
                shape: req.body.shape.trim(),
                brandId: req.body.brand.trim(),
                description: req.body.description.trim(),
                regularPrice: req.body.regularPrice.trim(),
                discountPercentage: req.body.discountPercentage.trim(),
                bestDiscount: req.body.discountPercentage.trim(),
                discountPrice: salePrice,
                salePrice: salePrice,
                quantity: req.body.quantity.trim(),
                categoryId: req.body.category.trim(),
                rating: req.body.rating.trim(),
                image: resizedImageUrls,
            };
    
            const product = new Product(productData);
    
            const savedProduct = await product.save();
    
            if (savedProduct) {
                res.redirect('/admin/productsList');
            } else {
                console.log('Error saving product');
                res.status(500).send('Error saving product');
            }
        } catch (error) {
            console.error(error.message);
            res.redirect('/500')
            
        }
    },
    
    
    
    productsList : async (req, res) => {
        try {
            let admin = req.session.adminName;
            const userData = await Product.find({})
            if (userData) {
    
                res.render('productsList', { products: userData ,admin:admin})
            } else {
                res.write('No products')
                res.end()
            }
        } catch (error) {
            console.log(error.message)
            res.redirect('/500')
        }
    },
    
    
    blockProductList : async (req, res) => {
        try {
            const id = req.query.productId
            console.log("The productId:"+id)
            const userData = await Product.findByIdAndUpdate({ _id: id }, { $set: { is_active: false } })
            if (userData) {
                res.redirect('/admin/productsList')
            } else {
                console.log('product not found or update failed')
                res.status(404).send('product not found')
            }
        } catch (error) {
            console.log(error.message)
            res.redirect('/500')
        }
    },
    
    
    unBlockProductList : async (req, res) => {
        try {
            const id = req.query.productId
            const userData = await Product.findByIdAndUpdate({ _id: id }, { $set: { is_active: true } })
            if (userData) {
                res.redirect('/admin/productsList')
            } else {
                console.log('product not found or update failed')
                res.status(404).send('product not found')
            }
    
        } catch (error) {
            console.log(error.message)
            res.redirect('/500')
        }
    },
    
    
    
    deleteProduct: async (req, res) => {
        try {
            const id = req.query.productId;
    
            // Retrieve the product to get image paths
            const product = await Product.findById(id);
            if (!product) {
                res.status(404).send('Product not found');
                return;
            }
    
            // Delete the images from the file system
            product.image.forEach(imagePath => {
                if (fs.existsSync(imagePath)) {
                    fs.unlinkSync(imagePath);
                }
            });
    
            // Delete the product from the database
            await Product.deleteOne({ _id: id });
    
            res.redirect('/admin/productsList');
        } catch (error) {
            console.log(error.message);
            res.redirect('/500');
        }
    },
    
    
    editProductList : async (req, res) => {
        try {
            let admin = req.session.adminName;
            const id = req.query.id
            const userData = await Product.findOne({ _id: id })
            // console.log(userData)
            const brandData = await Brand.find({ is_active: true })
    
            const categoryData = await Category.find({ is_active: true })
            if (userData) {
                res.render('editProduct', { products: userData, category: categoryData, brand: brandData, admin:admin})
            }
    
        } catch (error) {
            console.log(error.message)
            res.redirect('/500')
        }
    },
    
    
    
    
    
    loadEditProductList : async (req, res) => {
        try {
            const id = req.query.id;
            const product = await Product.findOne({ _id: id });
    
            let Newimages = [];
            if (req.files.length > 0) {
                // Resize new images and prepare the array of new image paths
                await Promise.all(req.files.map(async (file) => {
                    const imagePath = `uploads/${file.filename}`;
                    const resizedImagePath = `uploads/resized_${file.filename}`;
    
                    // Resize the image
                    await sharp(imagePath)
                        .resize({ width: 400, height: 400 })
                        .toFile(resizedImagePath);
    
                    // Remove the original image
                    fs.unlink(imagePath, (err) => {
                        if (err) {
                            console.error('Failed to delete original image', err);
                        } else {
                            console.log('Original image deleted successfully');
                        }
                    });
    
                    Newimages.push(resizedImagePath);
                }));
    
                // Delete old images from the filesystem
                product.image.forEach((imagePath) => {
                    fs.unlink(path.resolve(imagePath), (err) => {
                        if (err) {
                            console.error(`Failed to delete image: ${imagePath}`, err);
                        }
                    });
                });
    
                // Replace old images with new images
                product.image = Newimages;
            } else {
                // Keep the old images if no new images are uploaded
                Newimages = product.image;
            }
    
            let salePrice;
            if (req.body.discountPercentage.trim() > 0) {
                salePrice = req.body.regularPrice - (req.body.regularPrice.trim() * req.body.discountPercentage / 100);
            } else {
                salePrice = req.body.regularPrice.trim();
            }
    
            const categoryData = await Category.findById(product.categoryId);
            const catDiscountPercentage = categoryData.discount;
    
            const bestDiscount = req.body.discountPercentage > catDiscountPercentage
                ? req.body.discountPercentage
                : catDiscountPercentage;
    
            const userData = await Product.findByIdAndUpdate(
                { _id: id },
                {
                    $set: {
                        title: req.body.title.trim(),
                        material: req.body.material.trim(),
                        color: req.body.color.trim(),
                        shape: req.body.shape.trim(),
                        brandId: req.body.brand.trim(),
                        description: req.body.description.trim(),
                        regularPrice: req.body.regularPrice.trim(),
                        discountPercentage: req.body.discountPercentage.trim(),
                        bestDiscount: bestDiscount,
                        salePrice: salePrice,
                        quantity: req.body.quantity.trim(),
                        categoryId: req.body.category.trim(),
                        rating: req.body.rating.trim(),
                        image: Newimages // Ensure images are updated here
                    }
                }
            );
    
            if (userData) {
                res.redirect('/admin/productsList');
            }
        } catch (error) {
            console.log(error.message);
            res.redirect('/500');
        }
    },
    
    

    loadHome: async (req, res, next) => {
        try {
            let user = req.session.userName;
          let page = 1;
    
          if (req.query.page) {
            page = req.query.page;
          }
    
          const limit = 12;

          const products = await Product.find({})
            .skip((page - 1) * limit)
            .limit(limit * 1)
            .exec();
            const count = await Product.find().countDocuments();
          return res.render("index", {
           
            products,
            pages: Math.ceil(count / limit),
            current: page,
            previous: page - 1,
            nextPage: Number(page) + 1,
            limit,
            count,
            user:user
          });
        } catch (err) {
          console.log(err);
          next(err);
        }
      },
    
      
   
    productDetails : async (req, res) => {
        try {
            const id = req.query.id
            let user = req.session.userName;
            const productData = await Product.findById({ _id: id }).populate('brandId')
            const categoryId=productData.categoryId
          
            const relatedProducts= await Product.find({categoryId:categoryId,is_active:true}).limit(4)
          
            if (productData) {
                res.render('productDetails', { product: productData, user: user, relatedProducts})
            } else {
                res.redirect('/home')
    
            }
        } catch (error) {
            console.log(error.message)
            res.redirect('/500')
        }
    },




}