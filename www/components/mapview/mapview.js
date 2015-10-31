angular.module('mapview', ['ngMap']) 
.directive('mapview', function(GeolocationService, $rootScope, CardsService) {
  return {
    scope: {},
    templateUrl: 'components/mapview/mapview.tpl.html',
    link: function($scope) {
      console.log(GeolocationService);

      $scope.userIcon = {
        scaledSize: [26, 26],
        anchor: [13, 13],
        url: 'img/user-loc.svg'
      };

      $scope.center = {
        lat: GeolocationService.lat,
        lng: GeolocationService.lon
      };

      $scope.markers = CardsService.cards;
      
      $rootScope.$on('newCard', function(event, data) {
        $scope.markers = CardsService.cards;
      });
    }
  };
});
