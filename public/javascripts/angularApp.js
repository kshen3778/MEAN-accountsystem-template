var app = angular.module('test', ['ui.router']);
//test account:
//user: helloworl@gmail.com (missing 'd' on purpose)
//password: helloworld
app.factory('locations', ['$http', 'auth', function($http, auth){
    var o = {
      locations: []  
    };
    
    //get all of users locations
    o.getAll = function(){
      return $http.get('/locations', {
        //pass JWT token
        headers: {Authorization: 'Bearer ' + auth.getToken()}
      }).success(function(data){
        angular.copy(data, o.locations);   
        
      });
    };
    
    //create a location
    o.create  = function(location){
      return $http.post('/locations', location, {
        headers: {Authorization: 'Bearer ' + auth.getToken()}
      }).success(function(data){
         o.locations.push(data); 
      });
    };
    
    //retrieve a single location
    o.get = function(id){
      return $http.get('/locations/' + id).then(function(res){
        return res.data;
      });
    };
    
    //edit a location
    o.editLocation = function(location, edits){
      console.log("edits");
      console.log(edits);
      return $http.put('/locations/' + location + '/edit', edits, {
        headers: {Authorization: 'Bearer ' + auth.getToken()}
      });
    };
    
    return o;
}]);

app.factory('auth', ['$http', '$window', function($http, $window){
    var auth = {};
    
    //save token into localstorage
    auth.saveToken = function(token){
      $window.localStorage['test-token'] = token;
    };
    
    //get token from localstorage
    auth.getToken = function(){
      return $window.localStorage['test-token'];  
    };
    
    //check if user is logged in
    auth.isLoggedIn = function(){
      var token = auth.getToken();
      if(token){
        var payload = JSON.parse($window.atob(token.split('.')[1]));
        return payload.exp > Date.now() / 1000;
      } else {
        return false;
      }
    };
    
    //return email of logged in user or org
    auth.currentUser = function(){
      if(auth.isLoggedIn()){
        var token = auth.getToken();
        var payload = JSON.parse($window.atob(token.split('.')[1]));
        return payload.email;
      }  
    };
    
    //register the user and save token
    auth.register = function(user){
      return $http.post('/register', user).success(function(data){
         auth.saveToken(data.token); 
      });
    };
    
    //register the org and save token
    auth.registerOrg = function(org){
      return $http.post('/registerorg', org).success(function(data){
        auth.saveToken(data.token);
      });
    };
    
    //login user and save the token
    auth.logIn = function(user){
      console.log("in auth factory's login method");
      console.log(user);
      return $http.post('/login', user).success(function(data){
        auth.saveToken(data.token); 
      });
    };
    
    //login an org
    auth.logInOrg = function(org){
      return $http.post('/loginorg', org).success(function(data){
        auth.saveToken(data.token);
      });
    };
    
    //logout and remove token
    auth.logOut = function(){
      $window.localStorage.removeItem('test-token');  
    };
    
    return auth;
}]);

//control user and locations
app.controller('MainCtrl', [
    '$scope',
    'locations',
    'auth',
    function($scope, locations, auth){
        $scope.locations = locations.locations;
        $scope.isLoggedIn = auth.isLoggedIn;
        
        //add a new location
        $scope.addLocation = function(){
          if(!$scope.name || $scope.name === ""){
              return;
          }  
          locations.create({
             name: $scope.name,
             address: $scope.address,
             city: $scope.city,
             country: $scope.country,
             data: $scope.data,
          });
        };
    }
]);

//controller for navbar
app.controller('NavCtrl', [
'$scope',
'auth',
function($scope,auth){
  //expose methods from auth factory
  $scope.isLoggedIn = auth.isLoggedIn;
  $scope.currentUser = auth.currentUser;
  $scope.logOut = auth.logOut;
}]);

app.controller('AuthCtrl', [
'$scope',
'$state',
'auth',
function($scope, $state, auth){
  $scope.user = {};
  
  //calls auth factory's register method
  $scope.register = function(){
    auth.register($scope.user).error(function(error){
      $scope.error = error;
    }).then(function(){
      $state.go('dashboard');
    });
  };
  
  //calls auth factory's registerOrg method
  $scope.registerOrg = function(){
    auth.registerOrg($scope.org).error(function(error){
      $scope.error = error;
    }).then(function(){
      $state.go('orgdashboard'); //organization dashboard
    })
  };
  
  //calls the auth factory's login method
  $scope.logIn = function(){
    console.log("in AuthCtrl");
    console.log($scope.user);
    auth.logIn($scope.user).error(function(error){
      $scope.error = error;
    }).then(function(){
      $state.go('dashboard'); //user dashboard
    });
  };
  
  //calls the auth factory's logInOrg method
  $scope.logInOrg = function(){
    auth.logInOrg($scope.org).error(function(error){
      $scope.error = error;
    }).then(function(){
      $state.go('orgdashboard');
    });
  };
  
}]);

//control a location's details
app.controller('LocationCtrl', [
'$scope',
'locations',
'location', //injected via the location state's resolve
'auth',
function($scope, locations, location, auth){
  console.log(location);
  $scope.location = location;
  $scope.isLoggedIn = auth.isLoggedIn;
  
  $scope.editLocation = function(){
        console.log("edit location");
        locations.editLocation(location._id, {
          //body: $scope.body
          edits: {
            name: $scope.name,
            address: $scope.address,
            city: $scope.city,
            country: $scope.country,
            data: $scope.data
          }
        }).success(function(data){
          console.log("new location data");
          console.log(data);
          location = data;
        });

        $scope.body = '';

  };
  
}]);

app.config([
'$stateProvider',
'$urlRouterProvider',
function($stateProvider, $urlRouterProvider){
  
  //user dashboard state (get all tasks)
  $stateProvider.state('dashboard', {
    url: '/dashboard',
    templateUrl: 'partials/dashboard.html'
    /*controller: 'MainCtrl',
    resolve: {
      tasksPromise: ['tasks', function(tasks){
        return tasks.getAll();
      }]
    }*/
  });
  
  $stateProvider.state('orgdashboard', {
    url: '/orgdashboard',
    templateUrl: 'partials/orgdashboard.html'
    /*controller: 'MainCtrl',
    resolve: {
      tasksPromise: ['tasks', function(tasks){
        return tasks.getAll();
      }]
    }*/
  });
  
  //task state (single task)
  //TODO later
  /*$stateProvider.state('location', {
    url: '/locations/{id}',
    templateUrl: '/location.html',
    controller: 'LocationCtrl',
    resolve: {
      //injected into LocationCtrl
      location: ['$stateParams', 'locations', function($stateParams, locations){
        return locations.get($stateParams.id);
      }]
    }
  });*/
  
  //user login state
  $stateProvider.state('login', {
    url: '/login',
    templateUrl: 'partials/login.html',
    controller: 'AuthCtrl',
    onEnter: ['$state', 'auth', function($state,auth){
      if(auth.isLoggedIn()){
        $state.go('dashboard');
      }
    }]
  });
  
  //organization login state
  $stateProvider.state('loginOrg', {
    url: '/loginOrg',
    templateUrl: 'partials/loginOrg.html',
    controller: 'AuthCtrl',
    onEnter: ['$state', 'auth', function($state, auth){
      if(auth.isLoggedIn()){
        $state.go('orgdashboard');
      }
    }]
  });
  
  $stateProvider.state('register', {
    url: '/register',
    templateUrl: 'partials/register.html',
    controller: 'AuthCtrl',
    onEnter: ['$state', 'auth', function($state,auth){
      if(auth.isLoggedIn()){
        $state.go('dashboard');
      }
    }]
  });
  
  $stateProvider.state('registerOrg', {
    url: '/registerOrg',
    templateUrl: 'partials/registerOrg.html',
    controller: 'AuthCtrl',
    onEnter: ['$state', 'auth', function($state, auth){
      if(auth.isLoggedIn()){
        $state.go('orgdashboard');
      }
    }]
  });
  
  $urlRouterProvider.otherwise('home');
  
}]);