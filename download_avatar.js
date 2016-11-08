'use strict'
/*we import all our required modules. token.json contains
my token and username and has been added to .gitignore
to remain private*/
const request = require('request');
const token = require('./token.json');
const fs = require('fs');

const GITHUB_USER = token.username;
const GITHUB_TOKEN = token.token;
/*set up a const to get */
const input = process.argv.slice(2)

console.log('Welcome to the GitHub Avatar Downloader!');


function getRepoContributors(repoOwner, repoName, cb) {
  // first we construct the url we want to GET by concatenating all the required info to form the proper url
  let requestURL = 'https://'+ GITHUB_USER + ':' + GITHUB_TOKEN + '@api.github.com/repos/' + repoOwner + '/' + repoName + '/contributors';

  //Next we make out get request using the url just created, but also adding the object {url: 'www.whatevr.com', headers: {'User-Agent': 'whoever'}}
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
        //   .on('response', function (response) {                           // These give you various info regarding the response (not necessary)
        //        console.log('Response Status Code: ', response.statusCode);
        //        console.log('Response Status Message: ', response.statusMessage);
        //        console.log('Response Content Type: ', response.headers['content-type'])
        //      });
        };

getRepoContributors(input[0], input[1], function(err, result) {

// I'll first write a function expression to process each of the avatars' url and download them into the specified path

  function downloadImageByURL(url, filePath) {

  request.get(url, function(err, response) {
    if (err) {
      throw error
    } else if (response.statusCode === 200) {
      console.log('Download complete!');            /*This line will print each time our loop completes below, not necessary, but a good
                                                      visual confirmation that stuff is working*/
    }
    })
  //   .on ('response', function (response) {                             // These give you various info regarding the response (not necessary)
  //   console.log('Response Status Code: ', response.statusCode);
  //   console.log('Response Status Message: ', response.statusMessage);
  // })

  .pipe(fs.createWriteStream(filePath));
  }

  /*Now our callback function will just loop over the contributors to get their avatars' url and specify a pathname for each
  and pass the outcomes to the downloadImageByURL function*/

  result.forEach(function(contributors) {
    let avatarUrl = contributors['avatar_url']
    let path = './avatars/' + contributors['login'] + '.jpg'
    downloadImageByURL(avatarUrl, path)
  });
});

