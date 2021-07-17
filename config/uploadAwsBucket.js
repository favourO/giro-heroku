const AWS = require('aws-sdk');
const ID = process.env.Access_Key_ID;
const SECRET = process.env.Secret_Access_Key;
const multer = require('multer');
const multerS3 = require("multer-s3");


const s3 = new AWS.S3({
    accessKeyId: ID,
    secretAccessKey: SECRET
});

const uploadToS3 = multer({

    storage: multerS3({
        s3,
        acl: 'public-read',
        bucket: process.env.BUCKET_NAME,
        destination: function(request, file, callback) {
            callback(null, '../public/uploads')
        },
        filename: function(request, file, callback) {
            callback(null, file.originalname)
        }
    }),
    limits: { fileSize: 25000000 }, // In bytes: 25000000 bytes = 25 MB
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    }
}).array('photos', 10);

exports.module = uploadToS3;