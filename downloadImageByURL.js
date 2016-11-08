'use strict'
const request = require('request');
var fs = require('fs');

let testUrl = 'https://avatars2.githubusercontent.com/u/2741?v=3&s=466';
let testPath = './avatars/test.jpg'


function downloadImageByURL(url, filePath) {

  request.get(url, function(err, response) {
    if (err) {
      throw error
    } else if (response.statusCode === 200) {
      console.log('Download complete!');
    }
  })
  .on ('response', function (response) {
    console.log('Response Status Code: ', response.statusCode);
    console.log('Response Status Message: ', response.statusMessage);
  })

  .pipe(fs.createWriteStream(filePath));
}

downloadImageByURL(testUrl, testPath)