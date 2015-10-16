var mongoose = require('mongoose');

var OrganizationSchema = new mongoose.Schema({
    name: String,
    description: String,
    city: String,
    country: String,
    email: String,
    tasks: [{type: mongoose.Schema.Types.ObjectId, ref: 'Task'}]
});

mongoose.model('Organization', OrganizationSchema);