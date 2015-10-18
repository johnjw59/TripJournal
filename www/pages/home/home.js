angular.module('page.home', [])
  .controller('HomeCtrl', function($scope) {
    $scope.test = "Hello, world!";
  })

  .controller("OAuthCtrl", function($scope, $cordovaOauth) {
      $scope.googleLogin = function() {
          $cordovaOauth.google("1011840488483-5svsjfnrr9von30eu147lp74qrvbef4p.apps.googleusercontent.com", ["https://www.googleapis.com/auth/urlshortener", "https://www.googleapis.com/auth/userinfo.email"]).then(function(result) {
              console.log(JSON.stringify(result));
          }, function(error) {
              console.log(error);
          });
      }
  });
