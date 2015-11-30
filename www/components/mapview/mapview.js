angular.module('mapview', ['ngMap', 'rzModule']) 
.directive('mapview', function(GeolocationService, $rootScope, $timeout, CardsService) {
  return {
    scope: {
      markers: '=?markers',
      cards: '='
    },
    templateUrl: 'components/mapview/mapview.tpl.html',
    controller: function($scope, $state, $stateParams) {
      $scope.detail = function(event, card) {
        $state.go('detail',{card: card});
      };
      $scope.tripId = $stateParams.id;
    },
    link: function($scope) {
      var MS_PER_DAY = 1000 * 60 * 60 * 24;

      var id = $scope.tripId; // this will be defined for viewing past trips
      if (typeof id === 'undefined') {
        // we will do this for viewing current trip
        id = window.localStorage.getItem('trip_id');
      }
       
      var ParseTrip = Parse.Object.extend('Trip');
      var query = new Parse.Query(ParseTrip);
      $scope.trip = null;

      query.get(id, {
        success: function(trip) {
          $scope.trip = trip;
          var tripEndDate = trip.updatedAt;
          if (typeof trip.attributes.end != 'undefined') {
            tripEndDate = trip.attributes.end;
          }

          var tripLength = Math.ceil((tripEndDate - trip.attributes.start)/MS_PER_DAY);
          $scope.slider.options.ceil = tripLength;
          $scope.slider.options.step = Math.ceil(tripLength/10);
        },
        error: function(object, error) {
          console.log(error);
        }
      });

      $scope.slider = {
        minValue: 1,
        maxValue: 10,
        options: {
          ceil: 10,
          floor: 1,
          step: 1,
          showTicksValues: true
        }
      };

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
        $scope.cards = CardsService.cards;
        $scope.markers = $scope.cards;
        center = $scope.userLoc;
      }

      // Redraw map when the view changes and center it on user
      $scope.$on('changedView', function() {
        $timeout(function() {
          google.maps.event.trigger($scope.map, 'resize');
          $scope.center = center;
          console.log($scope);
        }, 250);
        $scope.cards = $scope.markers; // make a local copy for further filtering
      });      

      // Update path when the markers change
      $scope.$watch('markers', function(newVal, oldVal) {
        // console.log('markers watched', newVal);
        if (typeof newVal != 'undefined') {
          $scope.path = $scope.markers.map(function(marker) {
            return [marker.location.latitude, marker.location.longitude];
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
      
      $rootScope.$on('newCard', function(event, data) {
        $scope.cards = CardsService.cards;
        $scope.markers = $scope.cards;
      });

      $scope.$on('slideEnded', function() {
     // user finished sliding a handle 
        $scope.markers = $scope.cards.filter(function(card) {
          var tripStartDate = $scope.trip.attributes.start;
          var cardDate = card.createdAt;

          if (Math.ceil((cardDate-tripStartDate)/MS_PER_DAY) >= $scope.slider.minValue &&
            Math.ceil((cardDate-tripStartDate)/MS_PER_DAY) <= $scope.slider.maxValue) {
            return true;
          } else {
            return false;
          }
        });
        $scope.$apply();
        // console.log('filtered', $scope.markers);
      });
    }
  };
});
