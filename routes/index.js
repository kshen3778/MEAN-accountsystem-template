var express = require('express');
var mongoose = require('mongoose');
var passport = require('passport');
var jwt = require('express-jwt');
var User = mongoose.model('User');
var Organization = mongoose.model('Organization');
var Location = mongoose.model('Location');

var router = express.Router();

var auth = jwt({secret: 'SECRET', userProperty: 'payload'});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

//get user's locations
router.get('/locations', auth, function(req,res,next){
    User.findOne({email: req.payload.user.email}, function(err, user){
        
        if(err){return err;}

        user.populate('locations', function(err, locations){
            if(err){
                return next(err);
            }
            res.json(locations.locations);
        });
    });
});

//create locations
router.post('/locations', auth, function(req,res,next){
   var location = new Location(req.body); 
   location.user = req.payload.user;
   location.author = req.payload.email;
   
   location.save(function(err, location){
       //User.findOne({email: req.payload.email}, function(err, user){
           if(err){
               return next(err);
           }
           //req.payload.user.locations.push(location);
           //console.log(req.payload.user);
           User.update({email: req.payload.email},{$addToSet:{locations: location}},function(err, user){
              if(err){
                  return next(err);
              }
              res.json(location);
           });
       //});
   });
});

//preload location
router.param('location', function(req,res,next,id){
   var query = Location.findById(id);
   query.exec(function(err, location){
      if(err){
          return next(err);
      }
      if(!location){
          return next(new Error('can\'t find location'));
      }
      
      req.location = location;
      return next();
   });
});

//get specific location
router.get('/locations/:location',function(req, res, next){
    res.json(req.location);
});

//edit specific location
router.put('/locations/:location/edit', auth, function(req,res,next){
   console.log("req.");
   console.log(req.edits); //<---- the problem lies in req.body
   req.location.edit(req.edits, function(err, location){
       if(err){
           return next(err);
       }
       console.log("new location json");
       console.log(location);
       res.json(location);
   });
   
});

//user registration
router.post('/register', function(req, res, next){
   if(!req.body.email || !req.body.password){
       return res.status(400).json({message: 'Please fill out all fields'});
   } 
   
   var user = new User();
   
   user.email = req.body.email;
   user.setPassword(req.body.password);
   user.save(function(err){
       if(err){
           return next(err); 
       }
       console.log("registration");
       console.log(user);
       return res.json({token: user.generateJWT()});
   });
});

//organization registration
router.post('/registerorg', function(req, res, next){
   if(!req.body.email || !req.body.password){
       return res.status(400).json({message: 'Please fill out all fields'});
   }
   
   var org = new Organization();
   
   org.email = req.body.email;
   org.setPassword(req.body.password);
   org.save(function(err){
      if(err){
          return next(err);
      }
      return res.json({token: org.generateJWT()});
   });
   
});

//user login
router.post('/login', function(req,res,next){
   if(!req.body.email || !req.body.password || !req.body.name){
       return res.status(400).json({message: 'Please fill out all fields'});
   }
   
   passport.authenticate('user-local', function(err, user, info){
       if(err){ 
           return next(err); 
       }
       console.log(user);
       console.log(info);
       if(user){
           return res.json({token: user.generateJWT()});
       }else{
           return res.status(401).json(info);
       }
   })(req,res,next);
});

//organization login
router.post('/loginorg', function(req, res, next){
    if(!req.body.email || !req.body.password){
        return res.status(400).json({message: 'Please fill out all fields'});
    }
    
    passport.authenticate('org-local', function(err, org, info){
        if(err){
            return next(err);
        }
        if(org){
            return res.json({token: org.generateJWT()});
        }else{
            return res.status(401).json(info);
        }
    })(req,res,next);
})

module.exports = router;
