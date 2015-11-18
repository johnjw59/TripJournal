angular.module('page.newTrip', [])
.controller("NewTripCtrl", function($scope, $ionicHistory, $state, $ionicLoading) {
  // Only want to be on this page if we don't have a trip currently set
  if (window.localStorage.getItem('trip_id') !== null) {
    $state.go('home');
  }

  // Clear history on entering so we don't get weird back button issues
  $scope.$on('$ionicView.enter', function() {
    $ionicHistory.clearHistory();
  });

  $scope.$state = $state;

  $scope.startTrip = function() {
    $ionicLoading.show({
      template: 'Setting up your trip...'
    });
    var ParseTrip = Parse.Object.extend("Trip");

    var trip = new ParseTrip();
    trip.set('userId', '1'); // Should get from local storage
    trip.set('start', new Date());

    trip.save(null, {
      success: function(ret) {
        window.localStorage.setItem('trip_id', ret.id);
        $ionicLoading.hide();
        $state.go('home');
      },
      error: function(err) {
        console.error(err);
      }
    });
  };
});
