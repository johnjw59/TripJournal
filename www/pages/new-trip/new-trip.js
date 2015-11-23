angular.module('page.newTrip', [])
.controller("NewTripCtrl", function($scope, $ionicHistory, $timeout, $state, $ionicLoading, CardsService) {
  // Only want to be on this page if we don't have a trip currently set
  if (window.localStorage.getItem('trip_id') !== null) {
    $state.go('home');
  }

  // Clear history and cache on entering so we don't get weird back button issues
  $scope.$on('$ionicView.enter', function() {
    $ionicHistory.clearHistory();
    $ionicHistory.clearCache();
  });

  $scope.$state = $state;

  $scope.startTrip = function() {
    $ionicLoading.show({
      template: 'Setting up your trip...'
    });

    var ParseTrip = Parse.Object.extend("Trip");

    var trip = new ParseTrip();
    trip.set('userId', Parse.User.current().id);
    trip.set('start', new Date());

    trip.save(null, {
      success: function(ret) {
        window.localStorage.setItem('trip_id', ret.id);
        CardsService.update().then(function() {
          $timeout(function(){$ionicLoading.hide();},100);
          $state.go('home');
        });
      },
      error: function(err) {
        console.error('error');
      }
    });
  };
});
