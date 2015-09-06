var app = angular.module('test', ['ui.router']);

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
    
    //return username of logged in user
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
    
    //login and save the token
    auth.logIn = function(user){
      return $http.post('/login', user).success(function(data){
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
      $state.go('home');
    });
  };
  
  //calls the auth factory's login method
  $scope.logIn = function(){
    auth.logIn($scope.user).error(function(error){
      $scope.error = error;
    }).then(function(){
      $state.go('home');
    });
  };
}]);

app.config([
'$stateProvider',
'$urlRouterProvider',
function($stateProvider, $urlRouterProvider){
  
  //locations state
  $stateProvider.state('locations', {
    url: '/locations',
    templateUrl: '/locations.html',
    controller: 'MainCtrl'
  });
  
  //login state
  $stateProvider.state('login', {
    url: '/login',
    templateUrl: '/login.html',
    controller: 'AuthCtrl',
    onEnter: ['$state', 'auth', function($state,auth){
      if(auth.isLoggedIn()){
        $state.go('home');
      }
    }]
  });
  
  $stateProvider.state('register', {
    url: '/register',
    templateUrl: '/register.html',
    controller: 'AuthCtrl',
    onEnter: ['$state', 'auth', function($state,auth){
      if(auth.isLoggedIn()){
        $state.go('home');
      }
    }]
  });
  
  $urlRouterProvider.otherwise('home');
  
}]);