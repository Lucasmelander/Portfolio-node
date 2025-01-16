var express = require('express');
var router = express.Router();
const fs = require("fs");
const path = require("path");
const bodyParser = require('body-parser');

// Parse incoming JSON data
const jsonParser = bodyParser.json(); 

/* GET home page. */
router.get('/', function(req, res, next) {
  // Read introduction data
  let introductionData = fs.readFileSync(path.resolve(__dirname, "../data/introductionArray.json"));
  
  // Read recommendations data
  let recommendationsData = fs.readFileSync(path.resolve(__dirname, "../data/recommendations.json"));

  // Read portfolio data (cakes)
  let portfolioData = fs.readFileSync(path.resolve(__dirname, "../data/portfolio.json"));
  
  // Pass all data to the view
  res.render('index', {
    title: 'Portfolio',
    array: JSON.parse(introductionData),
    data: JSON.parse(recommendationsData),
    cakes: JSON.parse(portfolioData) // Pass cakes data to portfolio.ejs
  });
});

/* POST route to handle new recommendation submissions */
router.post('/', jsonParser, function(req, res, next) {
  // Read the existing recommendations data
  let rawdata = fs.readFileSync(path.resolve(__dirname, "../data/recommendations.json"));
  let recommendationsArray = JSON.parse(rawdata);

  // Check if the recommendation already exists based on the name
  if (recommendationsArray.filter(x => x.name === req.body.name).length === 0) {
    // Add the new recommendation to the array
    const newArray = recommendationsArray.concat([req.body]);

    // Write the updated array back to the recommendations.json file
    fs.writeFileSync(path.resolve(__dirname, "../data/recommendations.json"), JSON.stringify(newArray));

    // Send a success response
    res.status(200).json({ message: "Recommendation added successfully!" });
  } else {
    // Send an error response if the recommendation already exists
    res.status(400).json({ message: "Recommendation already exists!" });
  }
});

module.exports = router;
