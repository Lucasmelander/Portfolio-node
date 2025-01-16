var express = require('express');
var router = express.Router();
const fs = require("fs");
const path = require("path");
const bodyParser = require('body-parser');

// Use body-parser to handle JSON requests
const jsonParser = bodyParser.json();

/* GET home page. */
router.get('/', function(req, res, next) {
  // Read introduction data
  let introductionData = fs.readFileSync(path.resolve(__dirname, "../data/introductionArray.json"));
  
  // Read recommendations data
  let recommendationsData = fs.readFileSync(path.resolve(__dirname, "../data/recommendations.json"));

  // Hardcode or read cakes data from a JSON file
  let cakesData = [
    { category: "wedding", alt: "Wedding Cake", image: "/img/wedding_cake.jpg" },
    { category: "birthday", alt: "Birthday Cake", image: "/img/birthday_cake.jpg" },
    { category: "christmas", alt: "Christmas Cake", image: "/img/christmas_cake.jpg" },
    // Add more cake data as needed
  ];

  // Pass all data to the view
  res.render('index', {
    title: 'Portfolio',
    array: JSON.parse(introductionData),
    data: JSON.parse(recommendationsData),
    cakes: cakesData  // Passing cakes data to the view
  });
});

module.exports = router;
