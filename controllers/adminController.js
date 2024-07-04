
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


Logout : async (req, res) => {
    try {
        req.session.destroy()
        res.redirect('/admin/')
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
        // res.status(500).send('Internal Server Error');
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
}



}
