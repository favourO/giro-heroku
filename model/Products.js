const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    product_name: {
        type: String,
        required: [true, 'Please enter product name']
    }, 
    description: {
        type: String,
        required: [true, 'Please enter product description']
    },
    category: {
        type: String,
        required: [true, 'Please enter a product category']
    },
    price: {
        type: String,
        required: [true, 'Enter price for this product']
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    merchant: {
        type: mongoose.Schema.ObjectId,
        ref: 'Merchant',
        required: true
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    metaImageUrl: String,
    moreImageUrls: [String]
}, 
{
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
})



module.exports = mongoose.model('Products', ProductSchema);