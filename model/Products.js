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
    moreImageKeys: [String]
}, 
{
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
})


ProductSchema.methods.getImageKeys = function(arrayKeys) {
    for(let i=0; i< arrayKeys.length; i++){
        this.moreImageKeys.push(arrayKeys[i])
    }
    // this.moreImageKeys.concat(arrayKeys)
    return this.moreImageKeys
}


module.exports = mongoose.model('Products', ProductSchema);