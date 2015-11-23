angular.module('page.login', [])
.controller("LoginCtrl", function($scope, $state) {
  $scope.login = function() {
    Parse.User.logIn($scope.email, $scope.password, {
      success: function(user) {
        var userId = user.getUsername();
        console.log("Log in successful for user " + userId);

        var ParseTrip = Parse.Object.extend("Trip");
  
        //query user's trip ids and check for in-progress trip
        var query = new Parse.Query(ParseTrip);
        query.equalTo('userId', userId);
        query.doesNotExist('end');
        query.select('objectId');
        query.first({
          success: function(ret) {
            window.localStorage.setItem('trip_id', ret.id);
            $state.go('home');
          },
          error: function(err) {
            $state.go('new-trip');
          }
        });
      },
      error: function(user, error) {
        console.log("Error logging in with code " + error.code);
        alert("Oops: " + error.message + ". Please try again!");
      }
    });
  };
  $scope.register = function() {
    var user = new Parse.User();
    user.set("username", $scope.email);
    user.set("password", $scope.password);

    user.signUp(null, {
      success: function(user) {
        console.log("Registration success!");
        $state.go('new-trip');
      },
      error: function(user, error) {
        console.log("Error registering with code " + error.code);
        alert("Oops: " + error.message + ". Please try again!");
      }
    });
  };
});
