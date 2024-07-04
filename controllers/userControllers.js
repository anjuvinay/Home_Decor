
const User = require('../models/userModel')
const Product = require('../models/productModel')
const { json } = require('express')
const session = require('express-session')
require('dotenv').config()
const bcrypt=require("bcrypt")
const nodemailer =require('nodemailer')
const RandomString = require('randomstring')
const cron = require('node-cron')


module.exports = {

loadHome : async (req,res)=>{
    try {
        let user = req.session.userName;
        const products = await Product.find({})

        res.render("index",{user:user, products})
    } catch (error) {
        console.log(error.message)
        res.redirect('/500')
    }

},

loadSignup : async (req, res) => {
    try {
        res.render('user_signup', { message: '' })
    } catch (error) {
        console.log(error.message)
        res.redirect('/500')
    }
},


checkUniqueEmail : async (req, res, next) => {
    const { email } = req.body;

    try {
        const existingUser = await User.findOne({ email });

        if (existingUser) {

            res.render('user_signup', { message: 'Email already exists' })

        } else {
            next();
        }

    } catch (err) {
        console.log(err.message)
        res.redirect('/500')
    }
},


checkUniqueMobile : async (req, res, next) => {
    const { mobile } = req.body;

    try {
        const existingUser = await User.findOne({ mobile });

        if (existingUser) {

            res.render('user_signup', { message: 'Mobile already registered' })

        } else {
            next();
        }

    } catch (err) {
        console.log(err.message)
        res.redirect('/500')
    }
},



insertUser : async (req, res) => {
    try {
        if (req.body.password == req.body.confirmPassword) {
            const obj = {
                name: req.body.name,
                email: req.body.email,
                mobile: req.body.mobile,
                password: req.body.password,
                referralCode: req.body.referralCode
            }
            
            console.log(obj)

            req.session.data = obj
            if (obj.name) {
                res.redirect('/verifyOtp')
            } else {
                res.write('fill all fields')
            }
        }

    } catch (error) {
        console.log(error.message)
        res.redirect('/500')
    }
},


sendOtp : async (req, res) => {
    // req.session.otpIsVerified = true
    try {
        const { email } = req.session.data
        const randomotp = Math.floor(1000 + Math.random() * 9000);
        console.log(randomotp)
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: 'aanjups88@gmail.com',
                pass: process.env.NODEMAILER_PASS_KEY
            }
        });


        const mailOptions = {
            from: 'aanjups88@gmail.com',
            to: email,
            subject: 'Hello, Nodemailer!',
            text: `Your verification OTP is ${randomotp}`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log('Error sending email: ' + error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });

        req.session.otp = randomotp

        console.log(req.session.otp)
        setTimeout(() => {
            console.log('session ended')
        }, 30000);

        req.session.otpTime = Date.now()

        res.render('otpverification', { message: '' })

    } catch (error) {
        console.log(error.message)
        res.redirect('/500')
    }
},


verifyOtp : async (req, res) => {
    try {
        const otp = req.session.otp
        const randomotp = req.body.otp
        const timelimit = Date.now()

        if (timelimit - req.session.otpTime > 30000) {
            res.render('otpverification', { message: 'OTP timeout' })
        } else {
            const { name, email, mobile, password, referralCode } = req.session.data

            // console.log(req.session.otpIsVerified);
            // if (req.session.otpIsVerified) {
            if (randomotp == otp) {


                // const myReferralCode = await generateReferralCode();

                // async function generateReferralCode() {
                //     const randomString = RandomString.generate(5);
                //     const randomNumber = Math.floor(100 + Math.random() * 900).toString();
                //     const RandomReferralCode = randomString + randomNumber;

                    // const userData = await User.findOne({ RandomReferralCode });

                    // if (userData) {
                    //     return await generateReferralCode();
                    // } else {
                    //     return RandomReferralCode;
                    // }
                // }

                const salt=await bcrypt.genSalt(10)
                const hashedPassword=await bcrypt.hash(password,salt)
                const user = new User({
                    name: name,
                    email: email,
                    mobile: mobile,
                    password: hashedPassword,
                    // is_admin: 0,
                    // referralCode: myReferralCode

                })
                await user.save()

                // if (referralCode) {
                //     await User.findOneAndUpdate({ referralCode: referralCode }, { $inc: { wallet: +200 } })
                //     await User.findOneAndUpdate({ email: email }, { $set: { wallet: 100 } })
                // }

                res.redirect('/login')
            } else {
                res.render('otpverification', { message: 'Invalid Otp' })
            }

        }


    } catch (error) {
        console.log(error.message)
        res.redirect('/500')
    }
},


loginLoad : async (req, res) => {
    try {

        if (req.query.message === 'blocked') {
            res.render('user_login', { message: 'User is Blocked' })
        } else {
            res.render('user_login', { message: '' })
        }
    } catch (error) {
        console.log(error.message)
        res.redirect('/500')
    }
},


verifyLogin : async (req, res) => {
    try {
        const email = req.body.email

        const password = req.body.password
        const userData = await User.findOne({ email: email })
        // const productData = await Product.find({ is_active: true, catStatus: true })
        // console.log(productData)
        // console.log(userData.address[0].fname);
        if (userData) {
            // if (userData.is_active == true) {
                req.session.userName=userData.name
                
                const passwordMatch=await bcrypt.compare(password,userData.password)
                
                if (passwordMatch) {
                    req.session.email = email
                    res.redirect('/')
                } else {
                    res.render('user_login', { message: 'invalid password' })
                }
            } else {
                res.redirect('/login?message=blocked');
            }

        // } else {
        //     res.render('login', { message: 'User not found' })
        // }
    } catch (error) {
        console.log(error.message)
        res.redirect('/500')
    }
},


userLogout : async (req, res) => {
    try {
        req.session.destroy()
        res.redirect('/login')
    } catch (error) {
        console.log(error.message)
        res.redirect('/500')
    }
},


productDetails : async (req, res) => {
    try {
        const id = req.query.id
        let user = req.session.userName;
        const productData = await Product.findById({ _id: id })
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