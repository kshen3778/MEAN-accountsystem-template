var mongoose = require('mongoose');

var LocationSchema = new mongoose.Schema({
    name: String,
    address: String,
    city: String,
    country: String,
    data: String,
    author: String,
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}
});

mongoose.model('Location', LocationSchema);