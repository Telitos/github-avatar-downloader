'use strict'
/*Import required modules*/
require('dotenv').config();
const request = require('request');
const fs = require('fs');
const imgDownloader = require('./imgDownloader');
/*Use process.env to import confidential info from .env*/
const GITHUB_USER = process.env.USERNAME;
const GITHUB_TOKEN = process.env.TOKEN;
/*set up a const to get arguments from the command line, dropping the first two elements*/
const input = process.argv.slice(2);

console.log('Welcome to the GitHub Avatar Downloader!');


const getRepoContributors = function (repoOwner, repoName, cb) {
  let requestURL = 'https://'+ GITHUB_USER + ':' + GITHUB_TOKEN + '@api.github.com/repos/' + repoOwner + '/' + repoName + '/contributors';
  /*make an if statement that terminates the function and output an error message if not exactly two arguments were inputted*/
  if (input.length !== 2) {
    console.log('Sorry, you must input exactly two arguments for this to work!');
    return ;
  }

    /*Next we make out get request using the url just created, but also adding the object
    {url: 'www.whatevr.com', headers: {'User-Agent': 'whoever'}}
    because that's what gitHub requires.*/
    request.get({ url: requestURL, headers: { 'User-Agent': 'random' }}, function (err, response, body) {
      if (err) {
      console.log('An error occurred:', err);
      throw err;
    } else if (response.statusCode === 200) {
      let data = JSON.parse(body);
      /*we know the body is JSON so we can parse it right away to pass it to our callback function
       given that we handled the error above, no error will ever be passed in our callback, so we pass null instead.*/
      cb(null, data);
      console.log("Data acquired!");
    };
  })
};

getRepoContributors(input[0], input[1], function(err, result) {

  if (err) {
    console.log('An error occurred:', err);
    throw err;
    /*as previsouly mentionned, no error will ever reach this point in our program, but should we
    want this part of the code to be used elswhere, errors will be handled by default*/
  }
  /*Now loop though the contributors and get their avatars*/
  result.forEach(function(contributors) {
    let avatarUrl = contributors['avatar_url'];
    let path = './avatars/' + contributors['login'] + '.jpg';
    imgDownloader.imgDownloader(avatarUrl, path);
  });
});

