var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local');
const fs = require("fs");
const path = require("path");

// Define Passport strategy
passport.use(new LocalStrategy(function verify(username, password, cb) {
    let usersArray = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../data/users.json")));
    let user = usersArray.find(x => x.username === username);
    if (user && user.password === password) {
        return cb(null, user);
    }
    return cb(null, false);
}));

passport.serializeUser(function (user, cb) {
    process.nextTick(function () {
        cb(null, { id: user.id, username: user.username });
    });
});

passport.deserializeUser(function (user, cb) {
    process.nextTick(function () {
        return cb(null, user);
    });
});

// Render login page
router.get('/', function (req, res) {
    res.render('login', { user: req.user || null });
});

// Handle login form submission
router.post('/password', passport.authenticate('local', {
    failureRedirect: '/login',
    failureMessage: 'Invalid username or password',
}), function (req, res) {
    // Render the login page with the logged-in user
    res.render('login', { user: req.user });
});

router.post('/logout', function(req, res, next) {
    req.logout(function(err) {
      if (err) { return next(err); }
      res.redirect('/login');
    });
  });
module.exports = router;
