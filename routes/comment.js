var express = require('express');
var router = express.Router({mergeParams: true});
var Campground = require('../models/campground');
var Comment = require('../models/comment');

// New
router.get('/new', isLoggedIn, function(req, res){
    Campground.findById(req.params.id, function(err, campground){
        if(err || !campground){
            console.log(err);
        } else {
            res.render('comments/new', {campground: campground});
        }
    });
});

// Create
router.post('', isLoggedIn, function(req, res){
    Campground.findById(req.params.id, function(err, campground){
        if(err || !campground){
            console.log(err);
        } else {
            Comment.create(req.body.comment, function(err, comment){
                if(err || !comment){
                    console.log(err);
                } else {
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    campground.comments.push(comment);
                    campground.save(err, function(){
                        res.redirect('/campgrounds/' + campground._id);
                    });
                }   
            });
        }
    });
});

//Edit route
router.get('/:commentID/edit', isCommentOwner, function(req, res){
    Comment.findById(req.params.commentID, function(err, comment){
        if(err || !comment){
            res.redirect('back');
        } else {
            res.render('comments/edit', {comment: comment, campgroundID: req.params.id});
        }
    });
});

//Update route
router.put('/:commentID', isCommentOwner, function(req, res){
    Comment.findByIdAndUpdate(req.params.commentID, req.body.comment, function(err, comment){
        if(err || !comment){
            res.redirect('back');
        } else {
            comment.save();
            res.redirect('/campgrounds/' + req.params.id);
        }
    });
});

router.delete('/:commentID', isCommentOwner, function(req, res){
    Comment.findByIdAndDelete(req.params.commentID, function(err){
        res.redirect('/campgrounds/' + req.params.id);
    });
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/login');
}

function isCommentOwner(req, res, next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.commentID, function(err, comment){
            if(err || !comment){
                res.redirect('back');
            } else {
                if(comment.author.id.equals(req.user._id)){
                    next();
                } else {
                    res.redirect('back');
                }
            }
        })
    } else {
        res.redirect('back');
    }
}

module.exports = router;