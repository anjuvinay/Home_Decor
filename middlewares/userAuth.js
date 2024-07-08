require('dotenv').config()
const User = require('../models/userModel')


const isLogin = async(req,res,next)=>{
    try{
        if(req.session.email){
          
            next()
        }
        else{
           
            res.redirect('/login')
        }
        
    }catch(error){
        console.log(error.message)
    }
}



const isBlocked = async (req, res, next) => {
    try {
        console.log("my email is: "+req.session.email)
        const userData = await User.findOne({ email: req.session.email });
        console.log("userDats is: "+userData)

        if (userData && userData.is_active === false) {
            req.session.destroy()
            // delete req.session.email
            res.redirect('/login?message=blocked');
            return     
        }

        next();
    } catch (error) {
        console.log(error.message)
    }
};



module.exports={
    isLogin,
    isBlocked
}