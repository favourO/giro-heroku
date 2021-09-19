const { request } = require('express');
const AwsConfig = require('../config/aws-config');
const asyncHandler = require('../middleware/async');
const User = require('../model/User');
const ErrorResponse = require('../util/errorResponse');


exports.createAccount = asyncHandler( async(request, response, next) => {
  const agent = 'none';
  const { username, email, phone, role, password } = request.body;

  await AwsConfig.initAWS ();
  await AwsConfig.setCognitoAttributeList(email,agent);
  await AwsConfig.getUserPool().signUp(email, password, AwsConfig.getCognitoAttributeList(), null, function(err, result){
    if (err) {
      response.status(422).json({
        success: false,
        Error: err
      })
    }
    
    
    const user = User.create({
      username,
      email,
      phone,
      role,
      password
    })

    if (!user) {
      response.status(400).json({
        success: false,
        data: `could not create user`
      })
    }
    const resp = {
      username: result.user.username,
      userConfirmed: result.userConfirmed,
      data: 'User created successfully'
    }

    response.status(200).json({
      success: true,
      data: resp
    })
    });
});


// User email verfication
// @route     /api/v1/giro-app/auth
// @access    Public
exports.verify = asyncHandler( async(request, response, next) => {
  const { email, verificationCode } = request.body;

  // find user with email
  const user = await User.findOne({
    email
  })

  // Check if email is in database
  if (user === null) {
    return next(
      new ErrorResponse(`User not found with email ${email}`, 404)
  );
  }

  // Check if user is already confirmed
  if(user.isEmailConfirmed === true) {
    return next(
      new ErrorResponse(`${user.email} already confirmed... you can now LOGIN`, 401)
  );
  }

  // verify user
  await AwsConfig.getCognitoUser(email).confirmRegistration(verificationCode, true, (err, result) => {
    if (err) {
      response.status(422).json({
        success: false,
        Error: err
      })
    }

    user.isEmailConfirmed = true
    user.save();

    response.status(202).json({
      result,
      data: `${email} successfully verified`
    })
    
  });
})


// @desc      login User
// @access    Public
// @route     /api/v1/giro-app/auth
exports.login = asyncHandler( async(request, response, next) => {
  const { email, password } = request.body;

  // Validate email and password
  if(!email || !password) {
    return next(new ErrorResponse('Please provide an email and password', 400));
  }

  // Check if user exist
  const user = await User.findOne({email}).select('+password');

  if (user.isEmailConfirmed !== true) {
    return next(new ErrorResponse('Email not yet confirmed', 401));
  } 

  if (!user) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }

  // Check if password matches
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
      return next(new ErrorResponse('Invalid credentials', 401));
  }

  // return token
  sendTokenResponse(user, 200, response)
})
// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, response) => {
  // Create token
  const token = user.getSignedJwtToken();

  const options = {
      expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
      httpOnly: true // enable cookie for client side
  }

  // Set cookies to secured in prod (http(s))
  if (process.env.NODE_ENV === 'production') {
      options.secure = true
  }

  const userLoginDetails = {
    success: true,
    token,
    role: user.role,
    status: user.status,
    emailConfirm: user.isEmailConfirmed,
    twoFactorEnable: user.twoFactorEnable,
    id: user._id,
    username: user.username,
    email: user.email,
    phone: user.phone,
    createdAt: user.createdAt
  }
  response
      .status(statusCode)
      .cookie('token', token, options)
      .json({
          // success: true,
          // token,
          userLoginDetails
      })
};

// @desc    Get current logged in user
// @route   POST /api/v1/auth/me
// @access  Private
exports.getMe = asyncHandler(async (request, response, next) => {
  const user = await User.findById(request.user.id);

  response.status(200).json({
      success: true,
      user
  })
})