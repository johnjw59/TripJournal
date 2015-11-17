angular.module('mapview', ['ngMap']) 
.directive('mapview', function(GeolocationService, $rootScope, CardsService) {
  return {
    scope: {},
    templateUrl: 'components/mapview/mapview.tpl.html',
    link: function($scope) {
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
