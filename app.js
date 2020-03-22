//Require all packages
var express         = require('express'),
    app             = express(),
    bodyParser      = require('body-parser'),
    mongoose        = require('mongoose'),
    Campground      = require('./models/campground'),
    Comment         = require('./models/comment'),
    User            = require('./models/user'),
    passport        = require('passport'),
    LocalStrategy   = require('passport-local'),
    methodOverride  = require('method-override'),
    flash           = require('connect-flash'),
    seedDB          = require('./seeds.js'),
    campgroundRoutes = require('./routes/campground'),
    commentRoutes   = require('./routes/comment'),
    indexRoutes     = require('./routes/index');

require('dotenv').config();
app.use(bodyParser.urlencoded({extended: true})); //Use BodyParser to retriev all data from Form
app.set('view engine', 'ejs'); //Setting view engine to ejs
app.use(express.static(__dirname + '/public')); //Search style.css in public

//Connecting with Database
mongoose.connect(process.env.DATABASEURL, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false});

app.use(flash());
app.locals.moment = require('moment');
//Autentification setup
app.use(require('express-session')({
    secret: 'what the mother fucker',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');
    next();
});

app.use(methodOverride('_method')); //for PUT and DELETE route
// seedDB();

// Setting routes
app.use(indexRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/comments', commentRoutes);

//Starting the server
app.listen(process.env.PORT, function(){
    console.log('YelpCamp App is Started');
});