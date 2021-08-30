const fs = require('fs');
const S3 = require('aws-sdk/clients/s3');
const path = require('path')

const bucketName = process.env.AWS_BUCKET_NAME
const region = process.env.AWS_COGNITO_REGION
const accessKeyId = process.env.AWS_ACCESS_KEY_ID
const secretAccessKey = process.env.AWS_SECRET_KEY

const s3 = new S3({
    region: region,
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey
})

exports.uploadFile = (file) => {
    const fileStream = fs.createReadStream(file.path);

    const params = {
        Bucket: bucketName,
        Body: fileStream,
        Key: file.filename
    }

    return s3.upload(params).promise();
}

exports.getFileStream = (fileKey) => {
    const params = {
        key: fileKey,
        Bucket: bucketName
    }

    return s3.getObject(params).createReadStream()
}