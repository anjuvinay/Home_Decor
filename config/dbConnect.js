
// const mongoose=require('mongoose')

// mongoose.connect("mongodb://localhost:27017/decorDB")
// .then(()=>{
//     console.log("Home_decor connected to database")
// })
// .catch(()=>{
//     console.log("failed to connect")
// })


const { default:mongoose }=require("mongoose")

const dbConnect= ()=>{
    try{
        const conn=mongoose.connect("mongodb://localhost:27017/decorDB")
        console.log("Database connected successfully")
    }
    catch(error){
        console.log("failed to connect")
    }
    
}


module.exports=dbConnect