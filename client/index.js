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

  $scope.saveFood = function(){
    console.log($scope.food);

    if($scope.food.$id){
      $scope.foods.$save($scope.food).then(function(){
        calcWeight();
        $scope.food = {};
      });
    } else{
      var now = new Date();
      $scope.food.date = now.getTime();
      $scope.foods.$add($scope.food).then(function(){
        calcWeight();
        $scope.food = {};
      });
    }
  };

  function calcWeight(){
    var totalCals = $scope.foods.reduce(function(acc, f){
      return acc + (f.calsPerServing * f.servings);
    }, 0);
    $scope.endWeight = $scope.user.weight + totalCals / 3500;
  }

  $scope.removeFood = function(food){
    $scope.foods.$remove(food).then(function(){
      calcWeight();
    });
  };

  $scope.editFood = function(food){
    $scope.food = food;
  };
}]);
