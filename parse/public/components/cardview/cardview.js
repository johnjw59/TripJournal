angular.module('tripCards', []) 
.directive('cardview', function($rootScope, CardsService) {
  return {
    templateUrl: 'components/cardview/cardview.tpl.html',
    link: function($scope) {
      $scope.cards = CardsService.cards;
    }
  };
});
