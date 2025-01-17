var express = require('express');
var router = express.Router();
const fs = require("fs");
const path = require("path");
const bodyParser = require('body-parser');
const request = require('request');
var ensureLogIn = require('connect-ensure-login').ensureLoggedIn;
var ensureLoggedIn = ensureLogIn();

// Use body-parser to handle JSON requests
const jsonParser = bodyParser.json();

/* POST route to add a portfolio item */
router.post('/', jsonParser, function (req, res) {
  try {
    const { name, url } = req.body;

    if (!name || !url) {
      return res.status(400).json({ message: "Name and URL are required." });
    }

    const portfolioPath = path.resolve(__dirname, "../data/portfolio.json");
    const imagePath = path.resolve(__dirname, "../data/img", name);

    // Read existing portfolio items
    let portfoliosArray = JSON.parse(fs.readFileSync(portfolioPath));

    // Check if the portfolio item already exists
    if (portfoliosArray.some((item) => item.name === name)) {
      return res.status(400).json({ message: "Portfolio item already exists!" });
    }

    // Download the image and add the portfolio item
    downloadImage(url, imagePath, (err) => {
      if (err) {
        return res.status(500).json({ message: "Failed to download image.", error: err.message });
      }

      portfoliosArray.push(req.body);

      // Save the updated portfolio array
      fs.writeFileSync(portfolioPath, JSON.stringify(portfoliosArray, null, 2));

      res.status(200).json({ message: "Portfolio item added successfully!" });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error.", error: error.message });
  }
});

/* DELETE route to remove a portfolio item */
router.delete('/', jsonParser, ensureLoggedIn, function (req, res) {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Name is required." });
    }

    const portfolioPath = path.resolve(__dirname, "../data/portfolio.json");
    const imagePath = path.resolve(__dirname, "../data/img", name);

    // Read existing portfolio items
    let portfoliosArray = JSON.parse(fs.readFileSync(portfolioPath));

    // Filter out the item to be deleted
    const updatedArray = portfoliosArray.filter((item) => item.name !== name);

    if (updatedArray.length === portfoliosArray.length) {
      return res.status(404).json({ message: "Portfolio item not found." });
    }

    // Delete the image file
    fs.unlink(imagePath, (err) => {
      if (err) {
        console.warn(`Failed to delete image: ${name}.`);
      } else {
        console.log(`Image deleted: ${name}`);
      }
    });

    // Save the updated portfolio array
    fs.writeFileSync(portfolioPath, JSON.stringify(updatedArray, null, 2));

    res.status(200).json({ message: "Portfolio item deleted successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error.", error: error.message });
  }
});

/* Function to download an image */
function downloadImage(url, filepath, callback) {
  request.head(url, (err) => {
    if (err) {
      console.error("Error downloading image:", err);
      return callback(err);
    }
    request(url)
      .pipe(fs.createWriteStream(filepath))
      .on("close", () => {
        console.log(`Image saved to: ${filepath}`);
        callback(null);
      })
      .on("error", (err) => {
        console.error("Error saving image:", err);
        callback(err);
      });
  });
}

module.exports = router;

