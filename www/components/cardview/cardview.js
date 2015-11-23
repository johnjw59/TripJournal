angular.module('tripCards', []) 
.directive('cardview', function($rootScope, CardsService) {
  return {
    scope: {
      cards: '=?cards'
    },
    templateUrl: 'components/cardview/cardview.tpl.html',
    link: function($scope) {
      // If cards aren't provided, use the ones from the service
      if (!$scope.hasOwnProperty('cards')) {
        $scope.cards = CardsService.cards;
      }

      $rootScope.$on('newCard', function(event, data) {
        $scope.cards = CardsService.cards;
      });
    }
  };
});
