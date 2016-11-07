'use strict'

const request = require('request');
const token = require('./token.json');
const fs = require('fs');

const GITHUB_USER = token.username;
const GITHUB_TOKEN = token.token;


console.log('Welcome to the GitHub Avatar Downloader!');


function getRepoContributors(repoOwner, repoName, cb) {
  // first we construct the url we want to GET concatenating all the required info to form the proper path
  let requestURL = 'https://'+ GITHUB_USER + ':' + GITHUB_TOKEN + '@api.github.com/repos/' + repoOwner + '/' + repoName + '/contributors';

  //Next we make out get request using the url just created, but also using the object {url: 'www.whatevr.com', headers: {'User-Agent': 'whoever'}}
  // because that's what gitHub requires.
  request.get({ url: requestURL, headers: { 'User-Agent': 'random' }}, function (err, response, body) {
          let error = err
          if (err) {
            throw err;
          } else if (response.statusCode === 200) {
            let data = JSON.parse(body) // we know the body is JSON so we can parse it right away to pass it to our callback function
            cb(error, data)
            console.log("Data acquired!") // just so we know the process is done
          };
        })
          .on('response', function (response) {                           // This give you various info regarding the response (not necessary)
               console.log('Response Status Code: ', response.statusCode);
               console.log('Response Status Message: ', response.statusMessage);
               console.log('Response Content Type: ', response.headers['content-type'])
             });
        }

getRepoContributors("jquery", "jquery", function(err, result) {
  console.log("Errors:", err);
  console.log("Result:", result);
});
