
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

            if (randomotp == otp) {


                const salt=await bcrypt.genSalt(10)
                const hashedPassword=await bcrypt.hash(password,salt)
                const user = new User({
                    name: name,
                    email: email,
                    mobile: mobile,
                    password: hashedPassword,
                   
                })
                await user.save()
              
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
        if(req.session.userName){
            res.redirect('/')
          }
          else{

        if (req.query.message === 'blocked') {
            res.render('user_login', { message: 'User is Blocked' })
        } else {
            res.render('user_login', { message: '' })
        }
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
       
        if (userData && userData.is_active==true) {
           
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




}