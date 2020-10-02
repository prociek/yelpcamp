var mongoose = require('mongoose');
var Comment = require('./comment');

// Campground Schema and Model
var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    imageID: String,
    price: String,
    description: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        username: String
    },
    comments: [ {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    }]
});

campgroundSchema.pre('remove', async function(next){
    try{
        await Comment.remove({'_id': {$in: this.comments}});
        next();
    } catch(err){
        next(err);
    }
});
module.exports = mongoose.model('Campground', campgroundSchema);