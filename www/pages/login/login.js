angular.module('page.login', [])
.controller("LoginCtrl", function($scope, $state, $ionicLoading) {
  $scope.login = function() {
    $ionicLoading.show({
      template: 'Logging in...'
    });
    Parse.User.logIn($scope.email, $scope.password, {
      success: function(user) {
        var userId = user.getUsername();

        var ParseTrip = Parse.Object.extend("Trip");
  
        // query user's trip ids and check for in-progress trip
        var query = new Parse.Query(ParseTrip);
        query.equalTo('userId', userId);
        query.doesNotExist('end');
        query.select('objectId');
        query.first({
          success: function(ret) {
            $ionicLoading.hide();
            if (typeof ret === 'undefined') {
              $state.go('new-trip');
            } else {
              window.localStorage.setItem('trip_id', ret.id);
              $state.go('home');
            }
          },
          error: function(err) {
            console.error(err);
          }
        });
      },
      error: function(user, error) {
        $ionicLoading.hide();
        console.error(error);
        alert("Oops: " + error.message + ". Please try again!");
      }
    });
  };

  $scope.register = function() {
    $ionicLoading({
      template: 'Creating your account...'
    });
    var user = new Parse.User();
    user.set("username", $scope.email);
    user.set("password", $scope.password);

    user.signUp(null, {
      success: function(user) {
        $ionicLoading.show();
        $state.go('new-trip');
      },
      error: function(user, error) {
        $ionicLoading.hide();
        console.error(error);
        alert("Oops: " + error.message + ". Please try again!");
      }
    });
  };
});
