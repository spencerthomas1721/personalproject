var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require("body-parser");
var logger = require('morgan');
var schoolInfoController = require('./controllers/schoolInfoController');
var createController = require('./controllers/createController');
var indexController = require('./controllers/indexController');
var user = require( './models/User' );
var flash = require('connect-flash');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

const passport = require('passport')
const configPassport = require('./config/passport')
configPassport(passport)

const mongoose = require('mongoose')
mongoose.connect( 'mongodb://localhost/personalproject' )
const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', function() {
  console.log("we are connected!")
})

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/loginerror', function(req,res){
  res.render('loginerror',{})
})

app.get('/login', function(req,res){
  res.render('login',{})
})

app.get('/profile', isLoggedIn, function(req, res) {
        res.render('profile', {
            user : req.user // get the user out of session and pass to template
        });
    });

    // route for logging out
app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    // facebook routes
    // twitter routes

    // =====================================
    // GOOGLE ROUTES =======================
    // =====================================
    // send to google to do the authentication
    // profile gets us their basic information including their name
    // email gets their emails
    app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));

    // the callback after google has authenticated the user
    app.get('/auth/google/callback',
            passport.authenticate('google', {
                    successRedirect : '/profile',
                    failureRedirect : '/loginerror'
            }));

    app.get('/login/authorized',
            passport.authenticate('google', {
                    successRedirect : '/profile',
                    failureRedirect : '/loginerror'
            }));

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {
    console.log("checking to see if they are authenticated!")
    // if user is authenticated in the session, carry on
    if (req.isAuthenticated()){
      console.log("user has been Authenticated")
      return next();
    }

    console.log("user has not been authenticated...")
    // if they aren't redirect them to the home page
    res.redirect('/login');
}

app.get('/', indexController.getAllSchoolInfo);
app.post('/saveSchoolInfo', indexController.saveSchoolInfo );
app.get('/schoolInfo', schoolInfoController.getAllSchoolInfo );
app.post('/saveSchoolInfo', schoolInfoController.saveSchoolInfo );
app.post('/deleteSchoolInfo', schoolInfoController.deleteSchoolInfo );
app.get('/create', createController.getAllCreateInfo);
app.post('saveCreateInfo', isLoggedIn, createController.saveCreateInfo);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
