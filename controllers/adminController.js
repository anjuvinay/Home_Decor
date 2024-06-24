
const User = require('../models/userModel')
const bcrypt=require('bcrypt')






const loadLogin = async (req, res) => {
    try {
        res.render('admin_login', { message: '' })
    } catch (error) {
        console.log(error.message)
        res.redirect('/500')
    }
}


const verifyLogin = async (req, res) => {
    try {
        const { email } = req.body
        const { password } = req.body
        const userData = await User.findOne({ email: email })
        if (userData) {
            if (userData.is_admin === 1) {
                console.log(userData.password)
                console.log(password)
                const passwordMatch=await bcrypt.compare(password,userData.password)
                console.log(passwordMatch)
                if (passwordMatch) {
                    req.session.adminId = userData._id
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
}






module.exports = {
    loadLogin,
    verifyLogin
}
    