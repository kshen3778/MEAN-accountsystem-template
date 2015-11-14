var mongoose = require('mongoose');

var TaskSchema = new mongoose.Schema({
    
    name: String,
    description: String,
    hours: Number,
    takers: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
    organization: {type: mongoose.Schema.Types.ObjectId, ref: 'Organization'}
});

//edit a task
//curl -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfaWQiOiI1NjI2YTZlN2QxZjkxZDM3MTVhNDcwMzkiLCJuYW1lIjoiTE9MIiwiZW1haWwiOiJsb2xAZ21haWwuY29tIiwidHlwZSI6Im9yZ2FuaXphdGlvbiIsIm9yZyI6eyJfaWQiOiI1NjI2YTZlN2QxZjkxZDM3MTVhNDcwMzkiLCJoYXNoIjoiZDIyNTYwMmY1MzY3Yzc4YTFkMDBhOGJiMzE5MjhjNmZmY2FjYWM4ZWZjZThjNGEyM2I5OThiZTljMmJiYWVkMWJjODcyMzZmN2MyMmVmODQ1ZjViMjZlOGIwMjU1MmM4OGM1YzU3OWM2OGRkNmEyYjZkZDk4MDA3OWRjM2M2ZTEiLCJzYWx0IjoiOGU2ODNjNWQwMjlkNTg1NDlhYmQyZjhiOTY2MTI1NjciLCJ0eXBlIjoib3JnYW5pemF0aW9uIiwiY291bnRyeSI6IkNhbmFkYSIsImNpdHkiOiJUb3JvbnRvIiwiZW1haWwiOiJsb2xAZ21haWwuY29tIiwibmFtZSI6IkxPTCIsIl9fdiI6MCwidGFza3MiOlsiNTYyY2UyMDFmNmE0MWUzZTI4NjI0MzRkIiwiNTYzNDA0Yjc2ZDc3ZDI4YTQ5MmVlNDZhIiwiNTYzNTA3NzUwNjU3YzhlMTRmZTYwYmEzIl19LCJleHAiOjE0NTE2ODI5NjIsImlhdCI6MTQ0NjQ5ODk2Mn0.oHiJPt1tQtPYp_Rd_o-YLBK8B-bC3BNnsc7-gzOK4XA" -X PUT -d '{"name":"Edited","description":"Editeddesc","hours": 556}' -H "Content-Type: application/json"  https://mean-accountsystem-template-kshen3778.c9.io/tasks/563e09b0eb6f714d10bf5eff/edit
TaskSchema.methods.edit = function(edits,cb){
        
        console.log(edits);
        
        this.name = edits.name;
    

        this.description = edits.description;
    

        this.hours = edits.hours;
    
    
        this.save(cb);
}

mongoose.model('Task', TaskSchema);