var express = require('express');
var router = express.Router({mergeParams: true});
var Campground = require('../models/campground');
var Comment = require('../models/comment');
var middleware = require('../middleware');

// New
router.get('/new', middleware.isLoggedIn, function(req, res){
    Campground.findById(req.params.id, function(err, campground){
        if(err || !campground){
            req.flash('error', 'Something went wrong.');
            req.redirect('back');
        } else {
            res.render('comments/new', {campground: campground});
        }
    });
});

// Create
router.post('/', middleware.isLoggedIn, function(req, res){
    Campground.findById(req.params.id, function(err, campground){
        if(err || !campground){
            req.flash('error', 'Something went wrong.');
            res.redirect('back');
        } else {
            Comment.create(req.body.comment, function(err, comment){
                if(err || !comment){
                    req.flash('error', 'Something went wrong.');
                    res.redirect('back');
                } else {
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    campground.comments.push(comment);
                    campground.save(err, function(){
                        req.flash('success', 'Successfully added comment.');
                        res.redirect('/campgrounds/' + campground._id);
                    });
                }   
            });
        }
    });
});

//Edit route
router.get('/:commentID/edit', middleware.isCommentOwner, function(req, res){
    Comment.findById(req.params.commentID, function(err, comment){
        if(err || !comment){
            req.flash('error', 'Something went wrong.');
            res.redirect('back');
        } else {
            res.render('comments/edit', {comment: comment, campgroundID: req.params.id});
        }
    });
});

//Update route
router.put('/:commentID', middleware.isCommentOwner, function(req, res){
    Comment.findByIdAndUpdate(req.params.commentID, req.body.comment, function(err, comment){
        if(err || !comment){
            req.flash('error', 'Something went wrong.');
            res.redirect('back');
        } else {
            comment.save();
            req.flash('success', 'Comment was eddited.');
            res.redirect('/campgrounds/' + req.params.id);
        }
    });
});

router.delete('/:commentID', middleware.isCommentOwner, function(req, res){
    Comment.findByIdAndDelete(req.params.commentID, function(err){
        if(err){
            req.flash('error', 'Something went wrong.');
            res.redirect('/campgrounds/' + req.params.id);
        } else {
            req.flash('success', 'Successfully deleted comment.');
            res.redirect('/campgrounds/' + req.params.id);
        }
    });
});

module.exports = router;