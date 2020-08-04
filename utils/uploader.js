/**
 * Upload the image file to Google Storage
 * @param {File} file object that will be uploaded to Google Storage
 */

const { Storage } = require('@google-cloud/storage');
const Multer = require('multer');
const config = require('../utils/config');
const { format } = require('util');
const { v4: uuid } = require('uuid');


const storage = new Storage({
    projectId: config.projectId,
    keyFilename: './utils/service_account.json'
});

const bucket = storage.bucket(config.storageBucket);

const uploadImageToStorage = (file) => {
    return new Promise((resolve, reject) => {
        let generatedToken = uuid();
        if (!file) {
            reject('No image file');
        }
        let newFileName = `${file.originalname}_${Date.now()}`;

        let fileUpload = bucket.file(newFileName);

        const blobStream = fileUpload.createWriteStream({
            metadata: {
                contentType: file.mimetype
            }
        });

        blobStream.on('error', (error) => {
            reject('Something is wrong! Unable to upload at the moment.');
            console.log(error)
        });

        blobStream.on('finish', () => {
            // const url = format(`https://storage.googleapis.com/${bucket.name}/${fileUpload.name}`);
            const url = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${fileUpload.name}?alt=media&token=${generatedToken}`;
            resolve(url);
        });

        blobStream.end(file.buffer);
    });
}

module.exports = { uploadImageToStorage } 