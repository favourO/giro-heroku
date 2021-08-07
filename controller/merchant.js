const asyncHandler = require('../middleware/async');
const Merchant = require('../model/Merchants');
const User = require('../model/User');
const ErrorResponse = require('../util/errorResponse');


//Create Merchant
//@access           Private
//@route            /api/v1/giro-app/user/:userid/create-merchant
exports.createMerchant = asyncHandler( async(request, response, next) => {{
    request.body.user = request.params.userid;

    // Only existing users can create an account
    const user = await User.findById(request.params.userid)

    if (!user) {
        return next(new ErrorResponse(`User with ID ${request.params.userid} does not exist, create a user account to continue`));
    }

    // check if merchant already exist
    let merchant = await Merchant.findById(request.params.userid)
    if (merchant) {
        return next(new ErrorResponse(`Merchant with ID ${request.params.userid} already exist, Merchant cannot create another`));
    }

    merchant = await Merchant.create(request.body);

    user.role = 'merchant';
    user.save();

    response.status(201).json({
        success: true,
        data: merchant
    })
}})


// Get all merchants
// @route           /api/v1/giro-app/merchants
// @route           Public
exports.getMerchants = asyncHandler( async(request, response,next) => {
    response.status(200).json(response.advancedResults);
})