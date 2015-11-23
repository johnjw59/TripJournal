angular.module('page.detail', [])
.controller("DetailCtrl", function($scope, $state, $stateParams) {
  $scope.$state = $state;
  $scope.card = $stateParams.card;
});