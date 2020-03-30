var express = require('express');
var router = express.Router();
var Campground = require('../models/campground');
var middleware = require('../middleware');
var multer = require('multer');
var cloudinary = require('cloudinary');

require('dotenv').config();

var storage = multer.diskStorage({
  filename: function(req, file, callback) {
    callback(null, Date.now() + file.originalname);
  }
});
var imageFilter = function (req, file, cb) {
    // accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};
var upload = multer({ storage: storage, fileFilter: imageFilter})

cloudinary.config({ 
  cloud_name: 'dpushlins', 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});

//INDEX route to display all campgrounds
router.get('', function(req, res){
    if(req.query.search){
        var regex = new RegExp(escapeRegex(req.query.search), 'gi');
        Campground.find({name: regex}, function(err, campgrounds){
            if(err || !campgrounds.length > 0){
                req.flash('error', 'No matches found!');
                res.redirect('back');
            } else {
                console.log(campgrounds)
                res.render('campgrounds/index', {campgrounds: campgrounds});
            }
        });
    } else {
        Campground.find({}, function(err, campgrounds){
            if(err || !campgrounds){
                req.flash('error', 'Something went wrong.');
                res.redirect('back');
            } else {
                res.render('campgrounds/index', {campgrounds: campgrounds});
            }
        });
    }
});

//NEU route to display the Form
router.get('/new', middleware.isLoggedIn, function(req, res){
    res.render('campgrounds/new');
});

//CREATE route to create a campground
router.post('/', middleware.isLoggedIn, upload.single('image'), function(req, res){
    
    cloudinary.uploader.upload(req.file.path, function(result) {
        // add cloudinary url for the image to the campground object under image property
        //Retriev all data from Form
        var name = req.body.name;
        var image = result.secure_url;
        var imageID = result.public_id;
        var price = req.body.price;
        var desc = req.body.description;
        var author = {id: req.user._id, username: req.user.username};
        var newCampground = {name: name, image: image, price: price, description: desc, author: author, imageID: imageID};

        //Create new campground
        Campground.create(newCampground, function(err, campground){
            if(err || !campground){
                console.log(err);
                req.flash('error', 'Something went wrong.');
                res.redirect('back');
            } else {
                req.flash('success', 'Successfully created campground.')
                res.redirect('/campgrounds/' + campground._id);
            }
        });
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
router.put('/:id', middleware.isCampgroundOwner, upload.single('image'), function(req, res){
    Campground.findById(req.params.id, async function(err, campground){
        if(err || !campground){
            req.flash('error', 'Something went wrong.');
            res.redirect('back');
        } else {
            if(req.file){
                try{
                    await cloudinary.uploader.destroy(campground.imageID);
                    var result = await cloudinary.uploader.upload(req.file.path);
                    campground.image = result.secure_url;
                    campground.imageID = result.public_id;
                } catch(err){
                    req.flash('error', 'Something went wrong.');
                    res.redirect('back');
                }
            }
            campground.name = req.body.campground.name;
            campground.price = req.body.campground.price;
            campground.description = req.body.campground.description;
            campground.save();
            req.flash('success', 'Campground was eddited.');
            res.redirect('/campgrounds/' + req.params.id); 
            
        }
    });
});

//DELETE route
router.delete('/:id', middleware.isCampgroundOwner, function(req, res){
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            req.flash('error', 'Something went wrong.');
            res.redirect('/campgrounds');
        } else {
            cloudinary.uploader.destroy(campground.imageID, function(result) { 
                campground.remove(); 
                req.flash('success', 'Successfully deleted campground.');
                res.redirect('/campgrounds');
            });
        }
    });
});

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

module.exports = router;