var mongoose = require('mongoose');

var TaskSchema = new mongoose.Schema({
    
    name: String,
    description: String,
    hours: Number,
    takers: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
    organization: {type: mongoose.Schema.Types.ObjectId, ref: 'Organization'}
});

/*//edit a location
TaskSchema.methods.edit = function(edits,cb){
    
        this.name = edits.name;
    

        this.address = edits.address;
    

        this.city = edits.city;
    

        this.country = edits.country;
    

        this.data = edits.data;
    
        this.save(cb);
}*/

mongoose.model('Task', TaskSchema);