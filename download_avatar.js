'use strict'
/*we import all our required modules. token.json contains
my token and username and has been added to .gitignore
to remain private*/
const request = require('request');
const token = require('./token.json');
const fs = require('fs');

const GITHUB_USER = token.username;
const GITHUB_TOKEN = token.token;
/*set up a const to get arguments from the command line, dropping the first two elements*/
const input = process.argv.slice(2);

console.log('Welcome to the GitHub Avatar Downloader!');


function getRepoContributors(repoOwner, repoName, cb) {
  // first we construct the url we want to GET by concatenating all the required info to form the proper url
  let requestURL = 'https://'+ GITHUB_USER + ':' + GITHUB_TOKEN + '@api.github.com/repos/' + repoOwner + '/' + repoName + '/contributors';
  /*make an if statement that terminates the function and output an error message if not exactly two arguments were inputted*/
  if (input.length !== 2) {
    console.log('Sorry, you must input exactly two arguments for this to work!')
    return ;
  }

  //Next we make out get request using the url just created, but also adding the object {url: 'www.whatevr.com', headers: {'User-Agent': 'whoever'}}
  // because that's what gitHub requires.
  request.get({ url: requestURL, headers: { 'User-Agent': 'random' }}, function (err, response, body) {
    if (err) {
      console.log('An error occurred:', err)
      throw err;
    } else if (response.statusCode === 200) {
    let data = JSON.parse(body); // we know the body is JSON so we can parse it right away to pass it to our callback function
    cb(null, data);             // given that we handled the error above, no error will ever be passed in our callback, so we pass null instead.
    console.log("Data acquired!"); // just so we know the get request was succesfull
  };
})
        //   .on('response', function (response) {                           // These give you various info regarding the response (not necessary)
        //        console.log('Response Status Code: ', response.statusCode);
        //        console.log('Response Status Message: ', response.statusMessage);
        //        console.log('Response Content Type: ', response.headers['content-type'])
        //      });
};

getRepoContributors(input[0], input[1], function(err, result) {

// I'll first write a function expression to process each of the avatars' url and download them into the specified path
  if (err) {
    console.log('An error occurred:', err);
    throw err;                                    /*as previsouly mentionned, no error will ever reach this point in our program, but should we
                                                  want this part of the code to be used elswhere, errors will be handled by default*/
  }

  function downloadImageByURL(url, filePath) {

  request.get(url, function(err, response) {
    if (err) {
      throw error;
    } else if (response.statusCode === 200) {
      console.log('Download complete!');            /*This line will print each time our loop completes below, not necessary, but a good
                                                      visual confirmation that stuff is working*/
    }
    })
  //   .on ('response', function (response) {                             // These give you various info regarding the response (not necessary)
  //   console.log('Response Status Code: ', response.statusCode);
  //   console.log('Response Status Message: ', response.statusMessage);
  // })

  .pipe(fs.createWriteStream(filePath)); /*.pipe actually downloads the file into the specified path*/
  }

  /*Now our callback function will just loop over the contributors to get their avatars' url and specify a pathname for each
  and pass the outcomes to the downloadImageByURL function*/

  result.forEach(function(contributors) {
    let avatarUrl = contributors['avatar_url']
    let path = './avatars/' + contributors['login'] + '.jpg'
    downloadImageByURL(avatarUrl, path)
  });
});

