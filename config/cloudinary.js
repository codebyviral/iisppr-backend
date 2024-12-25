const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: '' ,
  api_key: 11,
  api_secret: '',
});

module.exports = cloudinary;
