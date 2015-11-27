angular.module('page.trip', ['tripCards', 'mapview', 'ngMap'])
.controller("TripCtrl", function($scope, $stateParams, $ionicLoading, $ionicTabsDelegate, $ionicPopup, CardsService, $timeout, $cordovaClipboard) {
  // Set default tab on view load
  $scope.$on('$ionicView.enter', function() {
    if ($scope.tab == 'map') {
      $ionicTabsDelegate.select(1);
      $scope.tab = 'map';
    }
    else {
      $ionicTabsDelegate.select(0);
      $scope.tab = 'cards';
    }
  });
  $scope.changeView = function() {
    $scope.tab = ($scope.tab == 'cards') ? 'map' : 'cards';
    $scope.$broadcast('changedView');
  };

  $ionicLoading.show({
    template: 'Loading trip...',
    noBackDrop: true
  });

  CardsService.getTrip($stateParams.id)
  .then(function(cards) {
    $scope.cards = cards;
    $timeout(function(){$ionicLoading.hide();},100);
  });
});
