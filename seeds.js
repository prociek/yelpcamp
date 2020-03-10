var mongoose = require('mongoose');
var Campground = require('./models/campground');
var Comment = require('./models/comment');

var data = [
    {
        name: 'Firepit',
        image: 'https://images.unsplash.com/photo-1530541930197-ff16ac917b0e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60',
        description: 'group of people sitting on front firepit'
    },
    {
        name: 'Mountailns and see',
        image: 'https://images.unsplash.com/photo-1508873696983-2dfd5898f08b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60',
        description: 'woman and a dog inside outdoor tent near body of water'
    },
    {
        name: 'Night',
        image: 'https://images.unsplash.com/photo-1515444744559-7be63e1600de?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60',
        description: 'man standing beside camping tent wearing headlamp during nighttime'
    },
    {
        name: 'Gory',
        image: 'https://images.unsplash.com/photo-1580473490637-86ca7968b84f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
    }
];

function seedDB(){
    Campground.deleteMany({}, function(err){
        data.forEach(function(seed){
            Campground.create(seed, function(err, campground){
                if (err){
                    console.log(err);
                } else {
                    console.log('campground created');
                    Comment.create({title: 'dfdfjkdsajfk df dkfjd', author: 'Tomek'}, function(err, comment){
                        campground.comments.push(comment);
                        campground.save();
                    });
                }
            });
        });
    });
}

module.exports = seedDB;