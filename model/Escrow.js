const mongoose = require('mongoose');


const EscrowSchema = new mongoose.Schema({
    merchant_name: {
        type: String,
        required: [true, 'Merchant name cannot be empty']
    },
    merchant_ID: {
        type: String,
        required: [true, 'Merchant ID cannot be empty']
    },
    buyer_name: {
        type: String,
        required: [true, 'Buyer name cannot be empty']
    },
    buyer_ID: {
        type: String,
        required: [true, 'Buyer ID cannot be empty']
    },
    verified_by_buyer: {
        type: Boolean,
        default: false
    },
    amount: {
        type: Number,
        required: [true, 'Total amount field cannot be empty']
    },
    escrowToken: String, // contains identification info of both buyer and merchant
    createdAt: {
        type: Date,
        default: Date.now
    }
})