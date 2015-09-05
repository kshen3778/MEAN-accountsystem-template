var express = require('express');
var mongoose = require('mongoose');
var passport = require('passport');
var jwt = require('express-jwt');
var User = mongoose.model('User');
var Location = mongoose.model('Location');

var router = express.Router();

var auth = jwt({secret: 'SECRET', userProperty: 'payload'});

/* GET home page. */
router.get('/', function(req, res, next) {
  //res.render('index', { title: 'Express' });
  req.payload.user.populate('locations', function(err, locations){
        if(err){
            return next(err);
        }
        res.json(req.post);
  });
});

//get user's locations
/*router.get('/locations', auth, function(req,res,next){
    req.payload.user.populate('locations', function(err, locations){
        if(err){
            return next(err);
        }
        res.json(req.post);
    });
});*/

//create locations
router.post('/locations', auth, function(req,res,next){
   var location = new Location(req.body); 
   location.user = req.payload.user;
   
   location.save(function(err, location){
       if(err){
           return next(err);
       }
       req.payload.user.locations.push(location);
       req.payload.user.save(function(err, user){
          if(err){
              return next(err);
          }
          res.json(location);
       });
   });
});

//registration
router.post('/register', function(req, res, next){
   if(!req.body.email || !req.body.password){
       return res.status(400).json({message: 'Please fill out all fields'});
   } 
   
   var user = new User();
   
   user.email = req.body.email;
   user.setPassword(req.body.password);
   user.save(function(err){
       if(err){ return next(err); }
       return res.json({token: user.generateJWT()});
   });
});

//login
router.post('/login', function(req,res,next){
   if(!req.body.email || !req.body.password){
       return res.status(400).json({message: 'Please fill out all fields'});
   }
   
   passport.authenticate('local', function(err, user, info){
       if(err){ return next(err); }
       
       if(user){
           return res.json({token: user.generateJWT()});
       }else{
           return res.status(401).json(info);
       }
   })(req,res,next);
});

module.exports = router;
