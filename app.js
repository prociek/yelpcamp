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
    seedDB          = require('./seeds.js');

var campgroundRoutes = require('./routes/campground'),
    commentRoutes = require('./routes/comment'),
    indexRoutes = require('./routes/index');

app.use(bodyParser.urlencoded({extended: true})); //Use BodyParser to retriev all data from Form
app.set('view engine', 'ejs'); //Setting view engine to ejs
app.use(express.static(__dirname + '/public')); //Search style.css in public

//Connecting with Database
mongoose.connect('mongodb://localhost:27017/yelpcamp', { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false});

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
    next();
});

app.use(methodOverride('_method'));
// seedDB();

app.use(indexRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/comments', commentRoutes);

//Starting the server
app.listen(3000, function(){
    console.log('YelpCamp App is Started');
});