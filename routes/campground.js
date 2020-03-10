var express = require('express');
var router = express.Router();
var Campground = require('../models/campground');

//INDEX route to display all campgrounds
router.get('', function(req, res){
    Campground.find({}, function(err, campgrounds){
        if(err){
            console.log(err);
        } else {
            res.render('campgrounds/index', {campgrounds: campgrounds});
        }
    });
    
});

//NEU route to display the Form
router.get('/new', isLoggedIn, function(req, res){
    res.render('campgrounds/new');
});

//CREATE route to create a campground
router.post('', isLoggedIn, function(req, res){
    
    //Retriev all data from Form
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {id: req.user._id, username: req.user.username};
    var newCampground = {name: name, image: image, description: desc, author: author};

    //Create new campground
    Campground.create(newCampground, function(err, campground){
        if(err || !campground){
            console.log(err);
        } else {
            console.log('New Campground was created: ');
            //Redirect to index
            res.redirect('/campgrounds');
        }
    });

});

//SHOW route display datails 
router.get('/:id', function(req, res){
    Campground.findById(req.params.id).populate('comments').exec(function(err, campground){
        if(err || !campground){
            console.log(err);
        } else {
            res.render('campgrounds/show', {campground: campground});
        }
    });
});

//EDIT route
router.get('/:id/edit', isCampgroundOwner, function(req, res){
    Campground.findById(req.params.id, function(err, campground){
        if(err || !campground){
            res.redirect('back');
        } else {
            res.render('campgrounds/edit', {campground: campground});
        }
    });
});

//UPDATE route
router.put('/:id', isCampgroundOwner, function(req, res){
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, campground){
        if(err || !campground){
            res.redirect('back');
        } else {
            campground.save();
            res.redirect('/campgrounds/' + req.params.id);
        }
    });
});

//DELETE route
router.delete('/:id', isCampgroundOwner, function(req, res){
    Campground.findByIdAndDelete(req.params.id, function(err){
        res.redirect('/campgrounds');
    });
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/login');
}


function isCampgroundOwner(req, res, next){
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(err, campground){
            if(err || !campground){
                res.redirect('back');
            } else {
                if(campground.author.id.equals(req.user._id)){
                    next();
                } else {
                    res.redirect('back');
                }
            }
        });
    } else {
        res.redirect('back');
    }
}

module.exports = router;