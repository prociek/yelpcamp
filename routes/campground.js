var express = require('express');
var router = express.Router();
var Campground = require('../models/campground');
var middleware = require('../middleware');

//INDEX route to display all campgrounds
router.get('', function(req, res){
    Campground.find({}, function(err, campgrounds){
        if(err){
            req.flash('error', 'Something went wrong.');
            res.redirect('back');
        } else {
            res.render('campgrounds/index', {campgrounds: campgrounds});
        }
    });
    
});

//NEU route to display the Form
router.get('/new', middleware.isLoggedIn, function(req, res){
    res.render('campgrounds/new');
});

//CREATE route to create a campground
router.post('', middleware.isLoggedIn, function(req, res){
    
    //Retriev all data from Form
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {id: req.user._id, username: req.user.username};
    var newCampground = {name: name, image: image, description: desc, author: author};

    //Create new campground
    Campground.create(newCampground, function(err, campground){
        if(err || !campground){
            req.flash('error', 'Something went wrong.');
            res.redirect('back');
        } else {
            req.flash('success', 'Successfully created campground.')
            res.redirect('/campgrounds/' + campground._id);
        }
    });

});

//SHOW route display datails 
router.get('/:id', function(req, res){
    Campground.findById(req.params.id).populate('comments').exec(function(err, campground){
        if(err || !campground){
            req.flash('error', 'Something went wrong.');
            res.redirect('back');
        } else {
            res.render('campgrounds/show', {campground: campground});
        }
    });
});

//EDIT route
router.get('/:id/edit', middleware.isCampgroundOwner, function(req, res){
    Campground.findById(req.params.id, function(err, campground){
        if(err || !campground){
            req.flash('error', 'Something went wrong.');
            res.redirect('back');
        } else {
            res.render('campgrounds/edit', {campground: campground});
        }
    });
});

//UPDATE route
router.put('/:id', middleware.isCampgroundOwner, function(req, res){
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, campground){
        if(err || !campground){
            req.flash('error', 'Something went wrong.');
            res.redirect('back');
        } else {
            campground.save();
            req.flash('success', 'Campground was eddited.');
            res.redirect('/campgrounds/' + req.params.id);
        }
    });
});

//DELETE route
router.delete('/:id', middleware.isCampgroundOwner, function(req, res){
    Campground.findByIdAndDelete(req.params.id, function(err){
        if(err){
            req.flash('error', 'Something went wrong.');
            res.redirect('/campgrounds');
        } else {
            req.flash('success', 'Successfully deleted campground.');
            res.redirect('/campgrounds');
        }
    });
});

module.exports = router;