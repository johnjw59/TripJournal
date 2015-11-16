angular.module('tripCards', []) 
.directive('tripCard', function($rootScope, CardsService) {
  return {
    scope: {

    },
    templateUrl: 'components/cardview/cardview.tpl.html',
    link: function($scope) {
      try {
        CardsService.get();
      }
      catch(err) {
        console.error(err);
      }
      
      $scope.cards = CardsService.cards;

      $rootScope.$on('newCard', function(event, data) {
        $scope.cards = CardsService.cards;
      });
    }
  };
});
