
const mongoose=require("mongoose")
const categorySchema=mongoose.Schema({

   categoryName:{
       type:String,
       required:true
   },
   is_active:{
       type:Boolean,
       default:true
   },
   discount:{
       type:Number,
       default:0
   },
   
   offerStatus:{
       type:Boolean,
       default:false
   }

})

module.exports=mongoose.model('Category',categorySchema)
