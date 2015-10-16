var mongoose = require('mongoose');

var OrganizationSchema = new mongoose.Schema({
    name: String,
    description: String,
    city: String,
    country: String,
    email: {type: String, unique: true},
    hash: String,
    salt: String,
    tasks: [{type: mongoose.Schema.Types.ObjectId, ref: 'Task'}]
});

mongoose.model('Organization', OrganizationSchema);