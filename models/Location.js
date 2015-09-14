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

//edit a location
LocationSchema.methods.edit = function(edits,cb){
    if(edits.name){
        this.name = edits.name;
    }
    if(edits.address){
        this.address = edits.address;
    }
    if(edits.city){
        this.city = edits.city;
    }
    if(edits.country){
        this.country = edits.country;
    }
    if(edits.data){
        this.data = edits.data;
    }
    this.save(cb);
}

mongoose.model('Location', LocationSchema);