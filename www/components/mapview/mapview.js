angular.module('mapview', ['ngMap']) 
.directive('mapview', function(GeolocationService) {
  return {
    scope: {},
    templateUrl: 'components/mapview/mapview.tpl.html',
    link: function($scope, $rootScope) {
      console.log(GeolocationService);
      $scope.center = {
        lat: GeolocationService.lat,
        lng: GeolocationService.lon
      };
    }
  };
});
