angular.module('tripCards', []) 
.directive('cardview', function($rootScope, CardsService) {
  return {
    scope: {

    },
    templateUrl: 'components/cardview/cardview.tpl.html',
    link: function($scope) {      
      $scope.cards = CardsService.cards;

      $rootScope.$on('newCard', function(event, data) {
        $scope.cards = CardsService.cards;
      });
    }
  };
});
