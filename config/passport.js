var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var User = mongoose.model('User');
var Organization = mongoose.model('Organization');

passport.use('user-local', new LocalStrategy({usernameField: 'email'}, function(email, password, done){
        console.log("LocalStrategy");
        User.findOne({email: email}, function(err, user){
           if(err) { return done(err); }
           console.log("in passport strategy");
           console.log(user);
           if(!user){
               return done(null, false, {message: 'Incorrect email.'});
           }
           if(!user.validPassword(password)){
               return done(null, false, {message: 'Incorrect password.'});
           }
           return done(null, user);
        });
    }
));

passport.use('org-local', new LocalStrategy({usernameField: 'email'}, function(email, password, done){
    Organization.findOne({email: email}, function(err, organization){
      if(err){ return done(err); }
      if(!organization){
          return done(null, false, {message: 'Incorrect email.'});
      }
      if(!organization.validPassword(password)){
          return done(null, false, {message: 'Incorrect password.'});
      }
      return done(null, organization);
    });   
}));
