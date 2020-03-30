var mongoose = require('mongoose');

// Campground Schema and Model
var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    imageID: String,
    price: String,
    createDate: {type: Date, default: Date.now},
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
module.exports = mongoose.model('Campground', campgroundSchema);