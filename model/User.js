const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    name: {
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
    role: {
        type: String,
        enum: ['admin', 'buyer', 'merchant', 'moderator'],
        default: 'buyer',
    },
    password: {
      type: String,
      required: [true, 'Please add a password'],
      minlength: 8,
      select: false,
      // match: [
      //   /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/,
      //   'Password should contain Capital letters, special characters, numbers'
      // ],
      default: 'buyer'
    },
    status: {
      type: String,
      enum: ['Pending', 'Verified'],
      default: 'Pending'
    },
    verificationCode: {
      type: String,
      unique: true
    },
    verificationCodeExpire: Date,
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

UserSchema.methods.getConfirmationCode = function() {
  const verificationCode = Math.floor(100000 + Math.random() * 900000);

  this.verificationCodeExpire = Date.now() + 15 * 60 * 1000;
  return verificationCode;
}

module.exports = mongoose.model('User', UserSchema);