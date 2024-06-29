const isLogin = async(req,res,next)=>{
    try{
        if(req.session.adminId){
            console.log("session properly handled")
            next()
        }
        else{
            console.log('no sessin for isLogin')
            res.redirect('/admin/')
        }
        
    }catch(error){
        console.log(error.message)
    }
}




module.exports={
    isLogin
}