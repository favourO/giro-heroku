const asyncHandler = require("../middleware/async");
const User = require('../model/User');
const sendEmail = require('../util/sendEmail');
const ErrorResponse = require('../util/ErrorResponse');

// @desc        user registration
// @route       /giro-api/v1/auth
// @access      Public
exports.register = asyncHandler(async(request, response, next) => {
    const { name, email, password, role } = request.body;

    // Create user
    const user = await User.create({
        name,
        email,
        password,
        role
    })

    const verificationCode = user.getConfirmationCode();

    const message = `Enter the code to verify your account ${verificationCode}`;

    try {
        await sendEmail({
            email: user.email,
            subject: "Verification code",
            message
        })

        response.status(201).json({
            success: true,
            data: `Verification mail was sent to ${user.email}`
        })
    } catch (error) {
        console.log(error);
        user.verificationCode = undefined;
        user.verificationCodeExpire = undefined;

        await user.save({ validateBeforeSave: false });

        return next(new ErrorResponse('Email could not be sent', 500));
    }
})