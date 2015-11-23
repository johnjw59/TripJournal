angular.module('page.login', [])
.controller("LoginCtrl", function($scope, $state) {
  $scope.login = function() {
    Parse.User.logIn($scope.email, $scope.password, {
      success: function(user) {
        console.log("Login success!");
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
      },
      error: function(user, error) {
        alert("Error: " + error.code + " " + error.message);
      }
    });
  };
});
