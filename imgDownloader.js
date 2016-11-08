'use strict'

const request = require('request');
const fs = require('fs');

/*A pair of test arguments, should we need to test the function
let testUrl = 'https://avatars2.githubusercontent.com/u/2741?v=3&s=466';
let testPath = './avatars/test.jpg';*/


const downloadImageByURL = function (url, filePath) {
  request.get(url, function(err, response) {
    if (err) {
      throw err;
    } else if (response.statusCode === 200) {
      console.log('Download complete!');
    }
  })
  .pipe(fs.createWriteStream(filePath));
};

module.exports = {
  imgDownloader: downloadImageByURL
};