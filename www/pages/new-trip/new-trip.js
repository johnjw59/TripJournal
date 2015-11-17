angular.module('page.newTrip', [])
.controller("NewTripCtrl", function($scope, $state) {
  // Only want to be on this page if we don't have a trip currently set
  if (window.localStorage.getItem('trip_id') !== null) {
    $state.go('home');
  }

  $scope.$state = $state;

  $scope.startTrip = function() {
    var ParseTrip = Parse.Object.extend("Trip");

    var trip = new ParseTrip();

    trip.set('userId', '1');
    trip.set('start', new Date());

    trip.save(null, {
      success: function(ret) {
        window.localStorage.setItem('trip_id', ret.id);
        $state.go('home');
      },
      error: function(err) {
        console.error(err);
      }
    });
  };
});
