angular.module('mapview', ['ngMap']) 
.directive('mapview', function(GeolocationService, $rootScope, $timeout, CardsService) {
  return {
    scope: {},
    templateUrl: 'components/mapview/mapview.tpl.html',
    link: function($scope) {
      // redraw map when the view changes and center it on user
      $scope.$on('changedView', function() {
        $timeout(function() {
          google.maps.event.trigger($scope.map, 'resize');
           $scope.center = {
            lat: GeolocationService.lat,
            lng: GeolocationService.lon
          };
        }, 250);
      });

      $scope.userIcon = {
        scaledSize: [26, 26],
        anchor: [13, 13],
        url: 'img/user-loc.svg'
      };

      $scope.center = {
        lat: 0,
        lng: 0
      };

      $scope.markers = CardsService.cards;

      // might need to sort markers by date first or better make service always return in chrono order
      $scope.path = CardsService.cards.map(function(card) {
        return [card.location.latitude, card.location.longitude];
      });
      
      $rootScope.$on('newCard', function(event, data) {
        $scope.markers = CardsService.cards;

        $scope.path = CardsService.cards.map(function(card) {
          return [card.location.latitude, card.location.longitude];
        });
      });
    }
  };
});
