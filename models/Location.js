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
    
        this.name = edits.name;
    

        this.address = edits.address;
    

        this.city = edits.city;
    

        this.country = edits.country;
    

        this.data = edits.data;
    
        this.save(cb);
}

mongoose.model('Location', LocationSchema);