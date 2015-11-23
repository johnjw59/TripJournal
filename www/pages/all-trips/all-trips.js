angular.module('page.allTrips', [])
.controller("AllTripsCtrl", function($scope, $state, $timeout, $ionicLoading) {
  $scope.$state = $state;
  $scope.trips = [];

  $ionicLoading.show({
    template: 'Getting your trips...',
    noBackDrop: true
  });

  var ParseTrip = Parse.Object.extend("Trip");
  
  var query = new Parse.Query(ParseTrip);
  query.equalTo('userId', Parse.User.current().id);
  query.exists('end');
  query.descending("start");
  query.find({
    success: function(ret) {
      $scope.trips = ret;
      $scope.$apply();
      $timeout(function(){$ionicLoading.hide();},100);
    },
    error: function(err) {
      console.error(err);
    }
  });
});
