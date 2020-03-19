var mongoose = require('mongoose');

// Comment Schema and Model
var commentSchema = new mongoose.Schema({
    title: String,
    createDate: {type: Date, default: Date.now},
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        username: String
    }
});

module.exports = mongoose.model('Comment', commentSchema);