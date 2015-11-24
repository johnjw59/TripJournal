angular.module('page.signup', [])
.controller("SignupCtrl", function($scope, $state) {

  $scope.signup = function(newUser) {
    var user = new Parse.User();
    user.set("username", newUser.username);
    user.set("password", newUser.password);
    // user.set("email", "email@example.com");

    // other fields can be set just like with Parse.Object
    // user.set("phone", "415-392-0202");

    user.signUp(null, {
      success: function(user) {
        // Hooray! Let them use the app now.
        console.log(user);
        $state.go('home');
      },
      error: function(user, error) {
        // Show the error message somewhere and let the user try again.
        console.log(user);
        console.log(error);
        alert("Error: " + error.code + " " + error.message + " " + user);
      }
    });
  };

  $scope.reset = function() {
    $scope.user = {};
  };

  $scope.reset();
});