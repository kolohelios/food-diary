'use strict';

angular.module('food-diary', ['firebase'])
.run(['$rootScope', '$window', function($rootScope, $window){
  $rootScope.fbRoot = new $window.Firebase('https://fooddiary-kolohelios.firebaseio.com/');

}])
.controller('master', ['$scope', '$firebaseObject', '$firebaseArray', function($scope, $firebaseObject, $firebaseArray){

  var fbUser = $scope.fbRoot.child('user');
  var afUser = $firebaseObject(fbUser);

  $scope.user = afUser;

  $scope.showUserForm = function(){
    $scope.isUserFormShown = true;
  };

  $scope.saveUser = function(){
    $scope.user.$save();
    calcBMI($scope.user.weight);
    $scope.isUserFormShown = false;
  };

  $scope.user.$loaded().then(function(){
    calcBMI($scope.user.weight);
  });

  function calcBMI(weight){
    if($scope.user.heightunits === 'inches'){
      $scope.bmi = (weight * 703) / Math.pow($scope.user.height, 2);
    }
    else{
      $scope.bmi = (weight) / Math.pow($scope.user.height / 100, 2);
    }
  }

  var fbFoods = $scope.fbRoot.child('foods');
  var afFoods = $firebaseArray(fbFoods);

  $scope.foods = afFoods;

  $scope.foods.$loaded().then(function(){
     calcWeight();
  });

  $scope.addFood = function(){
    $scope.foods.$add($scope.food);
    var now = new Date();
    $scope.food.date = now.getTime();
    calcWeight();
  };

  function calcWeight(){
    var totalCals = 0;
    $scope.foods.forEach(function(f){
      totalCals += f.calsPerServing * f.servings;
    });
    $scope.endWeight = $scope.user.weight + totalCals / 3500;
  }
}]);
