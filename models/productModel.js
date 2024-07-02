const mongoose = require('mongoose')
const Category = require('../models/categoryModel');
const productSchema = mongoose.Schema({
   
    title: {
        type: String,
        required: true
    },
    size: {
        type: Number,
        required: true
    },
    color: {
        type: String,
        required: true
    },
    shape: {
        type: String,
        required: true
    },
    brandId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Brand'
    },
    description: {
        type: String,
        required: true
    },
    regularPrice: {
        type: Number,
        required: true
    },
    salePrice: {
        type: Number,
        required: true
    },
    image: [{
        type: String
    }],
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    },
    
    is_active: {
        type: Boolean,
        default: true
    },
    catStatus: {
        type: Boolean,
        default: true
    },
    discountPrice: {
        type: Number,
        default: null
    },
    quantity: {
        type: Number,
        default: 1
    },
    date: {
        type: Date,
        default: Date.now,
        get: (timestamp) => {
            return new Date(timestamp).toLocaleDateString('en-US');
        },
    },
    discountPercentage: {
        type: Number,
        default: 0
    },
    catDiscountPercentage: {
        type: Number,
        default: 0
    },
    bestDiscount: {
        type: Number,
        default: 0
    },
    rating:{
        type:Number,
        default: null
    },
    productReview: [
        {
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            },
            comment:{
                type:String
            },
            rating:{
                type:Number
            },
            date:{
                type:Date
            }
        }
    ]


})
productSchema.index({ title: 'text' });


module.exports = mongoose.model('Product', productSchema)