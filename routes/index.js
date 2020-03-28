var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/user');
var Campground = require('../models/campground');

router.get('/', function(req, res){
    res.render('landing');
});

router.get('/register', function(req, res){
    res.render('register');
});

router.post('/register', function(req, res){

    var newUser = new User({
        username: req.body.username,
        lastName: req.body.lastName,
        email: req.body.email,
        avatar: req.body.avatar
    })

    User.register(newUser, req.body.password, function(err, user){
        if(err){
            req.flash('error', err.message);
            return res.redirect('register');
        } 
        if(req.body.adminCode === 'admin123'){
            user.isAdmin = true;
            user.save();
        }
        passport.authenticate('local')(req, res, function(){
            req.flash('success', 'Successfully registred ' + req.user.username);
            res.redirect('/campgrounds');
        });
    });
});

router.get('/login', function(req, res){
    res.render('login');
});

router.post('/login', passport.authenticate('local', 
    {  
        //successRedirect: '/campgrounds',
        failureRedirect: '/login',
        //successFlash: 'Welcome ' ,
        failureFlash: 'Wrong login data'
    }), function(req, res){
        req.flash('success', 'Welcome ' + req.user.username);
        res.redirect('/campgrounds');
});

router.get('/logout', function(req, res){
    req.logout();
    req.flash('success', 'Logged out.');
    res.redirect('/campgrounds');
});

router.get('/user/:id', function(req, res){
    User.findById(req.params.id, function(err, user){
        if(err || !user.length>0){
            req.flash('error', 'Something went wrong.');
            res.redirect('back');
        } else {
            Campground.find().where('author.id').equals(user._id).exec(function(err, campgrounds){
                if(err || !campgrounds.length > 0){
                    req.flash('error', 'Something went wrong.');
                    res.redirect('back');
                } else {
                    console.log(campgrounds);
                    res.render('users/show', {user: user, campgrounds: campgrounds,});
                }
            });
        }
    });
});

module.exports = router;