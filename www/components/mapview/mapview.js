angular.module('mapview', ['ngMap']) 
.directive('mapview', function(GeolocationService, $rootScope, $timeout, CardsService) {
  return {
    scope: {
      markers: '=?markers'
    },
    templateUrl: 'components/mapview/mapview.tpl.html',
    link: function($scope) {
      var center = null;

      $scope.userIcon = {
        scaledSize: [26, 26],
        anchor: [13, 13],
        url: 'img/user-loc.svg'
      };
      $scope.userLoc = {
        lat: GeolocationService.lat,
        lng: GeolocationService.lon
      };

      // If markers aren't provided, use the ones from the service, and center on user
      if (!$scope.hasOwnProperty('markers')) {
        $scope.markers = CardsService.cards;
        center = $scope.userLoc;
      }

      // Redraw map when the view changes and center it on user
      $scope.$on('changedView', function() {
        $timeout(function() {
          google.maps.event.trigger($scope.map, 'resize');
          $scope.center = center;
          console.log($scope);
        }, 250);
      });      

      // Update path when the markers change
      $scope.$watch('markers', function(newVal, oldVal) {
        if (typeof newVal != 'undefined') {
          $scope.path = $scope.markers.map(function(card) {
            return [card.location.latitude, card.location.longitude];
          });

          // If center hasn't been set yet, set it to the first marker
          if (center === null) {
            center = {
              lat: $scope.markers[0].location.latitude,
              lng: $scope.markers[0].location.longitude
            };
          }
        }
      });
      
      $rootScope.$on('newCard', function(event, data) {
        $scope.markers = CardsService.cards;
      });
    }
  };
});
