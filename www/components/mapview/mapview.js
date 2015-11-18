angular.module('mapview', ['ngMap']) 
.directive('mapview', function(GeolocationService, $rootScope, $timeout, CardsService) {
  return {
    scope: {
      markers: '=?markers'
    },
    templateUrl: 'components/mapview/mapview.tpl.html',
    link: function($scope) {
      $scope.center = {
        lat: 0,
        lng: 0
      };

      $scope.userIcon = {
        scaledSize: [26, 26],
        anchor: [13, 13],
        url: 'img/user-loc.svg'
      };

      // If markers aren't provided, use the ones from the service
      if (!$scope.hasOwnProperty('markers')) {
        $scope.markers = CardsService.cards;
      }

      // Redraw map when the view changes and center it on user
      $scope.$on('changedView', function() {
        $timeout(function() {
          google.maps.event.trigger($scope.map, 'resize');
          $scope.center = {
            lat: GeolocationService.lat,
            lng: GeolocationService.lon
          };
        }, 250);
      });      

      // Update path when the markers change
      $scope.$watch('markers', function(newVal, oldVal) {
        if (typeof newVal != 'undefined') {
          $scope.path = $scope.markers.map(function(card) {
            return [card.location.latitude, card.location.longitude];
          });
        }
      });
      
      $rootScope.$on('newCard', function(event, data) {
        $scope.markers = CardsService.cards;
      });
    }
  };
});
