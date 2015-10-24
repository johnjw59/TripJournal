angular.module('page.setting', [])
  .controller("SettingCtrl", function($scope, $cordovaOauth) {
    $scope.authenticateUser = function() {
      $cordovaOauth.google("1011840488483-5svsjfnrr9von30eu147lp74qrvbef4p.apps.googleusercontent.com", ["https://www.googleapis.com/auth/urlshortener", "https://www.googleapis.com/auth/userinfo.email"]).then(function(result) {
        console.log(JSON.stringify(result));
      }, function(error) {
        console.log(error);
      });
    };

    $scope.authenticateTwitter = function() {
      $cordovaOauth.twitter(
        'MrNcTUs3R9avp1eR0P2krSqtF',
        'TWITTER_SECRET'
      ).then(function(result) {
        console.log(JSON.stringify(result));
      }, function(error) {
        console.log(error);
      });
    }
  });
