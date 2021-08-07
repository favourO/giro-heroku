const mongoose = require('mongoose');


const MerchantSchema = new mongoose.Schema({
    business_name: {
        type: String,
        required: [true, 'Please Enter a name to represent your brand']
    },
    brand_statement: {
        type: String,
        required: [true, 'Tell your customers what you do'],
        maxlength: [500, 'Your brand statement should not be more than 500 characters long']
    },
    corporate_email: {
        type: String,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email'
        ]
    },
    phone: {
        type: String,
        required: [true, 'Please add a phone number ']
      },
    address: {
      type: String,
      required: [true, 'Please add an address']
    },
    role: {
        type: String,
        required: [true, 'Please a']
    },
    location: {
        // GeoJSON Point
        type: {
          type: String,
          enum: ['Point']
        },
        coordinates: {
          type: [Number],
          index: '2dsphere'
        },
        formattedAddress: String,
        street: String,
        city: String,
        state: String,
        zipcode: String,
        country: String
    },
    createdAt: {
        type: Date,
        default: Date.now
      },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    merchant_ID: String,
    business_category: String,
    escrow_balance: String,
    order_balance: String,
    escrow_account_number: String
},
{
    toJSON: { virtuals: true},
    toObject: { virtuals: true }
})

MerchantSchema.pre('save', async function (next) {
    await this.model('Products').deleteMany({ products: this._id})
    next();
})

MerchantSchema.virtual('products', {
    ref: 'Products',
    localField: '_id',
    foreignField: 'products',
    justOne: false
})

module.exports = mongoose.model('Merchants', MerchantSchema);