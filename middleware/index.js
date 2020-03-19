var Campground = require('../models/campground');
var Comment = require('../models/comment');
var middleware = {

    isCampgroundOwner: function(req, res, next){
        if(req.isAuthenticated()){
            Campground.findById(req.params.id, function(err, campground){
                if(err || !campground){
                    req.flash('error', 'Something went wrong.');
                    res.redirect('back');
                } else {
                    if(campground.author.id.equals(req.user._id) || req.user.isAdmin){
                        next();
                    } else {
                        req.flash('error', 'You must own a campground to edit or delete.');
                        res.redirect('back');
                    }
                }
            });
        } else {
            req.flash('error', 'You must be Logged!')
            res.redirect('back');
        }
    },

    isCommentOwner: function(req, res, next){
        if(req.isAuthenticated()){
            Comment.findById(req.params.commentID, function(err, comment){
                if(err || !comment){
                    req.flash('error', 'Something went wrong.');
                    res.redirect('back');
                } else {
                    if(comment.author.id.equals(req.user._id) || req.user.isAdmin){
                        next();
                    } else {
                        req.flash('error', 'You must own a comment to edit or delete.');
                        res.redirect('back');
                    }
                }
            })
        } else {
            req.flash('error', 'You must be Logged!');
            res.redirect('back');
        }
    },

    isLoggedIn: function(req, res, next){
        if(req.isAuthenticated()){
            return next();
        }
        req.flash('error', 'You must be Logged!');
        res.redirect('/login');
    }
};

module.exports = middleware;