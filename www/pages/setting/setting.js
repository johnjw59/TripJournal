angular.module('page.setting', [])
.controller("SettingCtrl", function($scope, $cordovaOauth, $ionicPlatform, TwitterService, Parse) {
  $scope.authenticateUser = function() {
    $cordovaOauth.google("1011840488483-5svsjfnrr9von30eu147lp74qrvbef4p.apps.googleusercontent.com", ["https://www.googleapis.com/auth/urlshortener", "https://www.googleapis.com/auth/userinfo.email"])
    .then(function(result) {
      console.log(result);
      window.localStorage.setItem('google_access_token', result.access_token);
    }, function(error) {
      window.alert(error);
      console.log(error);
    });
  };

  $scope.authenticateGoogle = function() {
    Parse.Cloud.run('getGitHubData', {}).then(function(response) {
      console.log(response);
    });
  }

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
      console.log('is Authenticated')
    } else {
      console.log('not Authenticated')
      TwitterService.initialize().then(function(result) {
        if(result === true) {
          $scope.showLogin = false;
        }
      });
    }
  }
});
