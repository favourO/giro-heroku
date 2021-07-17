const mongoose = require('mongoose');


const OrderSchema = new mongoose.Schema({
    product_name: {
        type: String,
        required: [true, 'Enter Product name']
    },
    order_ID: {
        type: String,
        required: [true, 'Order must have an ID']
    },
    amount: {
        type: Number,
        required: [true, 'Order must have an amount']
    },
    merchant_name: {
        type: String,
        required: [true, 'Merchant name field cannot be empty']
    },
    merchant_ID: {
        type: String,
        required: [true, 'Merchant ID field cannot be empty']
    },
    buyer_name: {
        type: String,
        required: [true, 'Buyer name field cannot be empty']
    },
    buyer_ID: {
        type: String,
        required: [true, 'Buyer ID field cannot be empty']
    }
})