angular.module('mapview', ['ngMap', 'rzModule']) 
.directive('mapview', function(CardsService, $timeout) {
  return {
    scope: {
      markers: '=?markers'
    },
    templateUrl: 'components/mapview/mapview.tpl.html',
    controller: function($scope, $state) {
      $scope.range_slider_ticks_values = {
        minValue: 1,
        maxValue: 8,
        options: {
          ceil: 10, // change to $scope.endDay
          floor: 0,
          showTicksValues: true
        }
      };
    },
    link: function($scope) {
      var center = null;

      $scope.markers = CardsService.cards;

      // Redraw map when the view changes and center it on user
      $scope.$on('changedView', function() {
        $timeout(function() {
          google.maps.event.trigger($scope.map, 'resize');
          $scope.center = center;
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
      }, true);
      
    }
  };
});
