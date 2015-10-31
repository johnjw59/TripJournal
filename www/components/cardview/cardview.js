angular.module('tripCards', []) 
.directive('tripCard', function($rootScope, CardsService) {
  return {
    scope: {

    },
    templateUrl: 'components/cardview/cardview.tpl.html',
    link: function($scope) {
      // This would usually have been gotten from parse
      $scope.cards = CardsService.cards;

      $rootScope.$on('newCard', function(event, data) {
        $scope.cards = CardsService.cards;
      });
    }
  };
});
