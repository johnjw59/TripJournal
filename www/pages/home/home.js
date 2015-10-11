angular.module('page.home', ['tripCards'])
  .controller('HomeCtrl', function($scope) {
    $scope.test = "Hello, world!";
  });
