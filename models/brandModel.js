
const mongoose=require("mongoose")
const brandSchema=mongoose.Schema({

   brandName:{
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

module.exports=mongoose.model('Brand',brandSchema)
