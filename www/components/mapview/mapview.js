angular.module('mapview', ['ngMap']) 
.directive('mapview', function() {
  return {
    scope: {},
    templateUrl: 'components/mapview/mapview.tpl.html',
    link: function($scope, $rootScope) {

      $scope.center = {
        lat: 43.07493,
        lng: -89.381388
      };
    }
  };
});
