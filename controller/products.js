const ErrorResponse = require('../util/errorResponse');
const Product = require('../model/Products');
const asyncHandler = require('../middleware/async');
const multer = require('multer');
const path = require('path');
const util = require('util');
const fs = require('fs');
const upload = require('../config/uploadAwsBucket');
const Merchant = require('../model/Merchants');
const sharp = require("sharp");

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

// const storage = multer.diskStorage({
//     destination: function (request, file, cb) {
//       cb(null, 'public/uploads')
//     },
//     filename: function (request, file, cb) {
//       cb(null, file.fieldname + '-' + Date.now())
//     }
//   })
   
// const uploads = multer({ storage: storage })


// const multerStorage = multer.memoryStorage();

// const multerFilter = (req, file, cb) => {
//   if (file.mimetype.startsWith("image")) {
//     cb(null, true);
//   } else {
//     cb("Please upload only images.", false);
//   }
// };

// const uploads = multer({
//   storage: multerStorage,
//   fileFilter: multerFilter,
//   options: { useNewUrlParser: true, useUnifiedTopology: true },
// });

// const uploadFiles = uploads.array("images", 10); // limit to 10 images



const storage = multer.diskStorage({
    destination: function(request, file, cb) {
      cb(null, 'public/uploads')
    },
    filename: function(request, file, cb){ 
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
})

const uploads = multer({
  storage: storage
})


//PUT           Upload a photo for product
//@route        /api/v1/giro-app/product/:id/uploadimages
//@access       Private
exports.uploadProductImage = (uploads.single('file'), asyncHandler( async (request, response, next) => {
    
    const product = await Product.findById(request.params.id);
    const mfile = request.file

    console.log(request.file)
    
    if (!product) {
        return next(
            new ErrorResponse(`Product not found with id of ${request.params.id}`, 404)
        );
    }

    console.log(product.user)
    
    // Make sure only product owner can update them
    if (product.user.toString() !== request.params.id && request.user.role !== 'merchant') {
        return next(
            new ErrorResponse(`User ${request.params.id} is not authorized to delete this product`, 
            401)
        );
    }
    
    if(!mfile) {
      return next(
        new ErrorResponse(`Please upload a file`, 
        400)
    );
    
    }
    

    response.status(200).json({
      success: true,
      data: mfile
    })
    
}))




// exports.resizeImages = async (request, response, next) => {
//   if (!request.files) return next();

//   request.body.images = [];
//   await Promise.all(
//     request.files.map(async file => {
//       const newFilename = file.fieldname + '-' + Date.now()

//       await sharp(file.buffer)
//         .resize(640, 320)
//         .toFormat("jpeg")
//         .jpeg({ quality: 90 })
//         .toFile(`upload/${newFilename}`);

//       request.body.images.push(newFilename);
//     })
//   );

//   next();
// };


// exports.getResult = async (request, response) => {
//     if (request.body.images.length <= 0) {
//       return response.status(400).json(`You must select at least 1 image.`);
//     }
  
//     const images = request.body.images
//       .map(image => "" + image + "")
//       .join("");
  
//     return res.status(201).json(`Images were uploaded:${images}`);
//   };


// console.log(request.files)
//     if (req.files === undefined) {
//         console.log('uploadProductsImages Error: No File Selected!');
//         res.status(404).json({
//             success: false,
//             message:'Error: No file Selected'
//         })
//     } else {
//         let fileArray = req.files, fileLoc;
//         const images = [];
//         for(let i = 0; i < fileArray.length; i++) {
//             if(!fileArray[i].mimetype.startsWith('image')) {
//                 return next(new ErrorResponse('Please upload an image file', 400));
//             }
//             if(fileArray[i].size > process.env.MAX_FILE_UPLOAD){
//                 return next(new ErrorResponse(`Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`, 400));
//             }
//             fileLoc = fileArray[i].location;
//             images.push(fileLoc)
//         }
//         const productimage = Product.findByIdAndUpdate(request.params.id, { moreImageUrls: images });

        
//         console.log(request.params.id)

//         console.log(productimage)
//         response.status(200).json({
//             success: true,
//             data: productimage
//         })

//     }