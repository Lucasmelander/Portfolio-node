var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var passport = require('passport');
var session = require('express-session');
var JsonStore = require('express-session-json')(session);

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var homeRouter = require('./routes/home');
var aboutRouter = require('./routes/about');
var servicesRouter = require('./routes/services');
var recommendationsRouter = require('./routes/recommendations');
var portfolioRouter = require('./routes/portfolio');
var contactRouter = require('./routes/contact');
var loginRouter = require('./routes/login');

var app = express();

// Session setup
app.use(session({
    secret: 'keyboard cat', // Replace with a secure secret for production
    resave: false,
    saveUninitialized: false,
    store: new JsonStore()
}));
app.use(passport.authenticate('session'));

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Static file serving
app.use(express.static(path.join(__dirname, 'public'))); // Serves static files from the "public" directory
app.use('/images', express.static(path.join(__dirname, 'data', 'img')));
app.use('/bootstrap', express.static(path.join(__dirname, 'node_modules', 'bootstrap', 'dist'))); // Serve Bootstrap files
app.use(express.static(path.join(__dirname, 'node_modules/jquery/dist/'))); // Serve jQuery files
app.use(express.static(path.join(__dirname, 'node_modules/typed.js/lib'))); // Serve Typed.js files
app.use(express.static(path.join(__dirname, 'node_modules/bootstrap-icons'))); // Serve Bootstrap Icons

// Middlewares
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Routes
app.use('/', indexRouter);
app.use('/home', homeRouter);
app.use('/about', aboutRouter);
app.use('/services', servicesRouter);
app.use('/recommendations', recommendationsRouter);
app.use('/portfolio', portfolioRouter);
app.use('/contact', contactRouter);
app.use('/users', usersRouter);
app.use('/login', loginRouter);

// Catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// Error handler
app.use(function (err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
