'use strict';

angular.module('food-diary', ['firebase'])
.run(['$rootScope', '$window', function($rootScope, $window){
  $rootScope.fbRoot = new $window.Firebase('https://fooddiary-kolohelios.firebaseio.com/');

}])
.controller('master', ['$scope', '$firebaseObject', function($scope, $firebaseObject){

  var fbUser = $scope.fbRoot.child('user');
  var afUser = $firebaseObject(fbUser);

  $scope.user = afUser;

  $scope.saveUser = function(){
    $scope.user.$save();
    calcBMI();
  };

  $scope.user.$loaded().then(function(){
    calcBMI();
  });

  function calcBMI(){
    if($scope.user.heightunits === 'inches'){
      $scope.bmi = ($scope.user.weight * 703) / Math.pow($scope.user.height, 2);
    }
    else{
      $scope.bmi = ($scope.user.weight) / Math.pow($scope.user.height / 100, 2);
    }
  }
}]);
