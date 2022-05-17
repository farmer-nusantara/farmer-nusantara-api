const util = require('util')
const gc = require('../configs/cloudStorage');
const bucket = gc.bucket(process.env.BUCKET)
const path = require('path');

const uploadImage = (file, userId = Math.random(), forDo = 'other' ) => new Promise((resolve, reject) => {
  const { originalname, buffer } = file

  const uniqueName = forDo + '-' + userId  + '-' + Date.now() + path.extname(originalname);
  const blob = bucket.file(uniqueName);
  const blobStream = blob.createWriteStream({
    resumable: false
  });
  
  blobStream.on('finish', () => {
    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
    resolve(publicUrl)
  })
  .on('error', () => {
    reject(`Unable to upload image, something went wrong`)
  })
  .end(buffer);
});

module.exports = uploadImage;