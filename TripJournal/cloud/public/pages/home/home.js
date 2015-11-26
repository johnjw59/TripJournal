angular.module('page.home', ['tripCards', 'mapview', 'ionic'])
.controller('HomeCtrl', function($scope) {
  $scope.tab = 'cards';
  
  $scope.changeView = function() {
    $scope.tab = ($scope.tab == 'cards') ? 'map' : 'cards';
    $scope.$broadcast('changedView');
  };

});
