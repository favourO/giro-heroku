const ErrorResponse = require('../util/errorResponse');
const Product = require('../model/Products');
const asyncHandler = require('../middleware/async');
const path = require('path');
const util = require('util');
const fs = require('fs');
const Merchant = require('../model/Merchants');
const User = require('../model/User')
const sharp = require("sharp");
const { uploadFile, getFileStream } = require('../config/s3')

// Create Product
// @access        Private
// @route         /api/v1/giro-app/merchant/:merchantId/product
exports.createProduct = asyncHandler( async(request, response, next) => {
    request.body.merchant = request.params.merchantId;
    request.body.user = request.user.id;

    const user = await User.findById(request.user.id);

    const merchant = await Merchant.findById(request.params.merchantId);

    let product = await Product.findById(request.params.id)

    if(!merchant) {
        return next(new ErrorResponse(`No merchant exist with this ID ${request.params.merchantId}`));
    }

    if (request.user.role !== ('merchant' || 'admin')) {
        return next(new ErrorResponse(`The user with ID ${request.user.id} is not allowed to create a Product`));
    }

    let file = undefined, result = [], resultkeys = [];
    const fileArray = request.files;
    if (!fileArray) {
        response.json({
            status: false,
            data: 'add a product image'
        })
    } else {
        for (let i = 0; i < fileArray.length; i++){
            file = fileArray[i];
            const uploadResult = await uploadFile(file)
            result.push(uploadResult)
            resultkeys.push(uploadResult.Key)
        }
    }
    
    console.log(uploadResult)
    console.log(request.file)
    console.log(result)

    let { product_name,
        description,
        category,
        price } = request.body;

    const moreImageKeys = resultkeys;
    
    product = await Product.create({
        product_name,
        description,
        category,
        price,
        moreImageKeys,
        user,
        merchant
    });

    response.status(201).json({
        status: 'SUCCESS',
        count: product.length,
        data: product
    })
})


// Get all Products
//@access        Public
//@route        /api/v1/giro-app/products
exports.getProducts = asyncHandler( async(request, response, next) => {
    // response.header("Cache-Control", "no-cache, no-store, must-revalidate");
    // response.header("Pragma", "no-cache");
    // response.header("Expires", 0);
    
    response
    .status(200)
    .json(response.advancedResults);
})


// Get products a single product
//@access       Public
//@route        /api/v1/giro-app/products/:id
exports.getProduct = asyncHandler( async(request, response, next) => {
    const product = await Product.findById(request.params.id);

    if (!product) {
        return next(new ErrorResponse(`Product not found with id of ${request.params.id}`, 404));
    }

    response.status(200).json({
        success: true,
        count: product.length,
        data: product
    })
})


//PUT           update a product
//@access       Private
//@route        /api/v1/giro-api/products/:id
exports.updateProduct = asyncHandler( async(request, response, next) => {
    let product = await Product.findById(request.params.id);

    if (!product) {
        return next(new ErrorResponse(`Product not found with id of ${request.params.id}`, 404));
    }

    console.log(request.user.role)
    if (product.user.toString() !== request.user.id && request.user.role !== 'merchant') {
        return next(new ErrorResponse(`User ${request.params.id} is not authorized to update this product`))
    }

    product = await Product.findByIdAndUpdate(request.params.id, request.body, {
        new: true,
        runValidators: true
    })

    response.status(200).json({
        success: true,
        message: 'Update was successful',
        data: product
    })
})


// Delete product
exports.deleteProduct = asyncHandler( async(request, response, next) => {
    const product = Product.findById(request.params.id);

    if(!product) {
        return next(new ErrorResponse(`Product not found with id of ${request.params.id}`, 404));
    }

    if (product.user.toString() !== request.user.id && (request.user.role !== 'merchant' || request.user.role !== 'admin')) {
        return next(new ErrorResponse(`User with id ${request.params.id} is not authorized to delete this Product`, 401));
    }

    product.remove();
    response
        .status(200)
        .json({
            success: true,
            data: `Product with ${request.params.id} deleted successfully`
        })
})


//PUT           Upload a photo for product
//@route        /api/v1/giro-app/product/:id/uploadimages
//@access       Private
exports.uploadProductImage = asyncHandler( async (request, response, next) => {
    
    const product = await Product.findById(request.params.id);
    
    if (!product) {
        return next(
            new ErrorResponse(`Product not found with id of ${request.params.id}`, 404)
        );
    }
    
    // Make sure only product owner can update them
    if (product.user.toString() !== request.params.id && request.user.role !== 'merchant') {
        return next(
            new ErrorResponse(`User ${request.params.id} is not authorized to delete this product`, 
            401)
        );
    }
    
    let file = undefined, result = [], resultkeys = [], imageUrls = [];
    const fileArray = request.files;
    if(fileArray.length === 0){
        response.status(404).json({
            success:false,
            data: 'No images to upload'
        })
    }
    else{
        // file types should be processed at the frontend
        
        for (let i = 0; i < fileArray.length; i++){
            file = fileArray[i];
            const uploadResult = await uploadFile(file)
            result.push(uploadResult)
            resultkeys.push(uploadResult.Key)
            imageUrls.push(uploadResult.Location);
        }
    
        product.getImageKeys(resultkeys)
    
        //save a single element in an empty array
        // product.save();
    
        product.save()
    
        response.status(201).json({
            success: true,
            data: result,
            message:`Upload was successful`
        })
    }

    
})
