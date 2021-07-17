const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Please add a name']
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email',
        ],
    },
    phone: {
      type: String,
      unique: true,
      required: [true, 'Please add a phone number']
    },
    role: {
      type: String,
      default: 'buyer',
    },
    password: {
      type: String,
      required: [true, 'Please add a password'],
      minlength: 8,
      select: false
    },
    status: {
      type: String,
      enum: ['Pending', 'Verified', 'Veteran', 'Legend'],
      default: 'Pending'
    },
    
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    confirmEmailToken: String,
    isEmailConfirmed: {
      type: Boolean,
      default: false,
      },
      twoFactorCode: String,
      twoFactorCodeExpire: Date,
      twoFactorEnable: {
        type: Boolean,
        default: false,
      },
    createdAt: {
      type: Date,
      default: Date.now,
    },
});

// Encrypt password using 
UserSchema.pre('save', async function(next) {
    if(!this.isModified('password')) {
        next();
    }
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
})

// Sign JWT and return
UserSchema.methods.getSignedJwtToken = function() {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  })
}

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password)
}

// UserSchema.methods.getConfirmationCode = function() {
//   const verificationCode = Math.floor(100000 + Math.random() * 900000);

//   this.verificationCodeExpire = Date.now() + 15 * 60 * 1000;
//   return verificationCode;
// }

module.exports = mongoose.model('User', UserSchema);