const ErrorResponse = require('../util/errorResponse');
const Product = require('../model/Products');
const asyncHandler = require('../middleware/async');
const { response, request } = require('express');
const multer = require('multer');
const path = require('path');
const util = require('util');
const fs = require('fs');
const upload = require('../config/uploadAwsBucket');
const Merchant = require('../model/Merchants');

// Create Product
// @access        Private
// @route         /api/v1/giro-app/merchant/:merchantId/product
exports.createProduct = asyncHandler( async(request, response, next) => {
    request.body.merchant = request.params.merchantId;
    request.body.user = request.user.id;

    const merchant = await Merchant.findById(request.params.merchantId);

    if(!merchant) {
        return next(new ErrorResponse(`No merchant exist with this ID ${request.params.merchantId}`));
    }

    if (request.user.role !== ('merchant' || 'admin')) {
        return next(new ErrorResponse(`The user with ID ${request.user.id} is not allowed to create a Product`));
    }
    
    const product = await Product.create(request.body);

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
    response.header("Cache-Control", "no-cache, no-store, must-revalidate");
    response.header("Pragma", "no-cache");
    response.header("Expires", 0);
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
exports.uploadProductImage = asyncHandler( async(request, response, next) => {
    const product = await Product.findById(request.params.id);

    if (!product) {
        return next(
            new ErrorResponse(`Product not found with id of ${request.params.id}`, 404)
        );
    }

    // Make sure only product owner can update them
    if (product.user.toString() !== request.user.id && request.user.role !== 'admin') {
        return next(
            new ErrorResponse(`User ${request.params.id} is not authorized to delete this product`, 
            401)
        );
    }

    upload(req, res, (err) =>  {
        console.log('files', req.files);
        if(err) {
            console.log('errors', err);
            res.status(500).json({
                success: false,
                err
            })
        } else {
            if (req.files === undefined) {
                console.log('uploadProductsImages Error: No File Selected!');
                res.status(404).json({
                    success: false,
                    message:'Error: No file Selected'
                })
            } else {
                let fileArray = req.files, fileLoc;
                const images = [];
                for(let i = 0; i < fileArray.length; i++) {
                    if(!fileArray[i].mimetype.startsWith('image')) {
                        return next(new ErrorResponse('Please upload an image file', 400));
                    }
                    if(fileArray[i].size > process.env.MAX_FILE_UPLOAD){
                        return next(new ErrorResponse(`Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`, 400));
                    }
                    fileLoc = fileArray[i].location;
                    images.push(fileLoc)
                }
                const productimage = Product.findByIdAndUpdate(request.params.id, { moreImageUrls: images });

                response.status(200).json({
                    success: true,
                    data: productimage
                })

            }
        }
    })
    
})
