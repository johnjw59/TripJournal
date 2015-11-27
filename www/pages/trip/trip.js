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

  $scope.shareTrip = function() {
    var trip_url = 'https://tripjournalapp.parseapp.com/#/';
    trip_url += Parse.User.current().getUsername() + '/';
    trip_url += $stateParams.id;

    console.log(trip_url);
    $cordovaClipboard.copy(trip_url)
    .then(function() {
      var copy_notif = $ionic.Popup.show({
        title: 'Link copied to your Clipboard!'
      });
      $timeout(function() {
        copy_notif.close();
      }, 2000);
    }, function(err) {
      console.error(err);
      $ionic.Popup.show({
        title: 'Couldn\'t copy address',
        subTitle: trip_url
      });
    });
  };
});
