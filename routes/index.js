var express = require('express');
var router = express.Router();
const fs = require("fs");
const path = require("path");

/* GET home page. */
router.get('/', function(req, res, next) {
  // Read introduction data (assuming it's already being passed)
  let introductionData = fs.readFileSync(path.resolve(__dirname, "../data/introductionArray.json"));
  
  // Read recommendations data
  let recommendationsData = fs.readFileSync(path.resolve(__dirname, "../data/recommendations.json"));

  // Pass both sets of data to the view
  res.render('index', {
    title: 'Portfolio',
    array: JSON.parse(introductionData), // Existing data being passed
    data: JSON.parse(recommendationsData) // New data being passed for recommendations
  });
});

module.exports = router;
