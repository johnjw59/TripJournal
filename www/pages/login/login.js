angular.module('page.login', [])
.controller("LoginCtrl", function($scope, $state) {
  $scope.login = function() {
    Parse.User.logIn($scope.email, $scope.password, {
      success: function(user) {
        console.log("Login success!");
        if (window.localStorage.getItem('trip_id') === null) {
          $state.go('new-trip');
        } else {
          $state.go('home');
        }
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
