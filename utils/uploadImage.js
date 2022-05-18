const util = require('util')
const gc = require('../configs/cloudStorage');
const bucket = gc.bucket(process.env.BUCKET)
const path = require('path');

const uploadImage = (file, userId = Math.random()) => new Promise((resolve, reject) => {
  const { originalname, buffer } = file

  const uniqueName = userId  + '-' + Date.now() + path.extname(originalname);
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

const removeImage = async (imageUrl) => {
  try {
    const splitString = imageUrl.split('/');
    const filename = splitString.at(-1);
    const res = await bucket.file(filename).delete();
    
    if (!res) return false
    return true;
  } catch (error) {
    console.error(error);
  }
}

module.exports = { uploadImage, removeImage };