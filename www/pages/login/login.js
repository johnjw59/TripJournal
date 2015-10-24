angular.module('page.login', [])
.controller("LoginCtrl", function($scope, $state, $cordovaOauth) {
  $scope.login = function() {
    $cordovaOauth.google("1011840488483-5svsjfnrr9von30eu147lp74qrvbef4p.apps.googleusercontent.com", ["https://www.googleapis.com/auth/urlshortener", "https://www.googleapis.com/auth/userinfo.email"])
    .then(function(result) {
        console.log(JSON.stringify(result));
        // save result in local storage
        // if this is a new user, save it to parse (maybe do it anyway and let parse figure out what happens the user already exists?)
    }, function(err) {
        console.error(err);
    });
    $state.go('home');
  };
});
