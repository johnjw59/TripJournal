angular.module('page.setting', [])
.controller("SettingCtrl", function($scope, $state, $timeout, $ionicPlatform, $ionicHistory, $ionicLoading, $ionicPopup, TwitterService) {
  $scope.$state = $state;

  // Only show end trip button if I'm on a trip
  $scope.$on('$ionicView.enter', function() {
    $scope.on_trip = (window.localStorage.getItem('trip_id') === null) ? false : true;
  });

  $scope.endTrip = function() {
    var confirmPopup = $ionicPopup.confirm({
      title: 'End Current Trip?',
      template: 'Are you sure you want to end this trip? You will no longer be able to post new cards to it.'
    });
    confirmPopup.then(function(res) {
      if(res) {
        $ionicLoading.show({
          template: 'Ending your trip...'
        });
        var ParseTrip = Parse.Object.extend("Trip");
    
        var trip = new ParseTrip();
        trip.id = window.localStorage.getItem('trip_id');
        trip.set('end', new Date());
        
        trip.save(null, {
          success: function(ret) {
            window.localStorage.removeItem('trip_id');
            $timeout(function(){$ionicLoading.hide();},100);
            $state.go('new-trip');
          },
          error: function(err) {
            console.error(err);
          }
        });
      }
    });
  };

  $scope.showLogin = true;

  $ionicPlatform.ready(function() {
    if (TwitterService.isAuthenticated()) {
      $scope.showLogin = false;
      console.log('is Authenticated');
    }
  });

  $scope.authenticateTwitter = function() {
    if (TwitterService.isAuthenticated()) {
      $scope.showLogin = false;
      console.log('is Authenticated');
    } else {
      console.log('not Authenticated');
      TwitterService.initialize().then(function(result) {
        if(result === true) {
          $scope.showLogin = false;
        }
      });
    }
  };

  $scope.logOut = function() {
    Parse.User.logOut();
    $state.go('login');
  }
});
