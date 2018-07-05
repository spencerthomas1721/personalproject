const
  createError = require('http-errors')
  express = require('express')
  path = require('path')
  cookieParser = require('cookie-parser')
  bodyParser = require("body-parser")
  logger = require('morgan')
  schoolInfoController = require('./controllers/schoolInfoController')
  createController = require('./controllers/createController')
  indexController = require('./controllers/indexController')
  resultsController = require('./controllers/resultsController')
  user = require( './models/User' )
  flash = require('connect-flash')
  session = require('express-session')
  request = require('request')
  requestpromise = require('request-promise')
  cheerio = require('cheerio')
  fs = require('fs')
  formidable = require('formidable')

const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const passport = require('passport')
const configPassport = require('./config/passport')
configPassport(passport)

var app = express();

const mongoose = require('mongoose')
mongoose.connect( 'mongodb://localhost/personalproject' )
const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', function() {
  console.log("we are connected!")
})

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({secret:'zzbyanana'}))
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req,res,next) => {
  console.log("middleware to set loggedIn is being run")
  console.log("user is " + req.user)
  res.locals.loggedIn = false
  if (req.isAuthenticated()){
    console.log("user has been Authenticated")
    res.locals.user = req.user
    res.locals.loggedIn = true
  }
  next()
})

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
  app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }))

  app.get('/login/authorized',
    passport.authenticate('google', {
            successRedirect : '/',
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
app.get('/results', resultsController.renderResults, resultsController.attachCourseInfo);

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

var
  courseNums = []
  courseNames = []

/*request('http://registrar-prod.unet.brandeis.edu/registrar/schedule/classes/2018/Summer/1400/UGRD', function (error, response, html) {
  if (!error && response.statusCode == 200) {
    console.log('trying to scrape')
    var $ = cheerio.load(html);

    var json = { courseNum:"", courseName:""};

    $('.def').each(function(i, elem) {
      courseNums[i] = $(this).attr('name');
    })

    $('strong').each(function(i, elem) {
      courseNames[i] = $(this).text();
    })

    /*$('target="_blank"').each(function(i, elem) {
      prof = $(this).text();
    })*/

    /*for(j = 0; j < courseNums.length; j++) {
      console.log(courseNums[j] + ' - ' + courseNames[j])
    }
  }
})*/

app.listen('8081')

console.log('Magic happens on port 8081')

module.exports = app;
