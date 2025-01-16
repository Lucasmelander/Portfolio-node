var express = require('express');
var router = express.Router();
const fs = require("fs");
const path = require("path");
const bodyParser = require('body-parser');
var request = require('request');

// Use body-parser to handle JSON requests
const jsonParser = bodyParser.json();

/* POST route to handle new portfolio submissions */
router.post('/', jsonParser, function(req, res, next) {
  let rawdata = fs.readFileSync(path.resolve(__dirname, "../data/portfolio.json"));
  let portfoliosArray = JSON.parse(rawdata);

  // Check if the portfolio item already exists based on the name
  if (portfoliosArray.filter(x => x.name === req.body.name).length === 0) {
    // Download the image from the provided URL
    download(req.body.url, req.body.name, function() {
      console.log('Image download completed');

      // After downloading the image, add the new portfolio item
      const newArray = portfoliosArray.concat([req.body]);
      
      // Save the updated portfolio array back to the portfolio.json file
      fs.writeFileSync(path.resolve(__dirname, "../data/portfolio.json"), JSON.stringify(newArray));
      
      // Respond to the client
      res.status(200).json({ message: "Portfolio item added successfully!" });
    });
  } else {
    // Handle case where the item already exists
    res.status(400).json({ message: "Portfolio item already exists!" });
  }
});

// Function to download an image
var download = function(url, filename, callback) {
  request.head(url, function(err, res, body) {
    if (err) {
      console.log('Error downloading image:', err);
      return;
    }
    // Save the image to the data/img folder
    request(url).pipe(fs.createWriteStream(path.resolve(__dirname, '../data/img/', filename))).on('close', callback);
  });
};


module.exports = router;
