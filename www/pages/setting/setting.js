angular.module('page.setting', [])
.controller("SettingCtrl", function($scope, $cordovaOauth, $ionicPlatform, TwitterService, $rootScope) {
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

  $scope.showLogin = true;
  $scope.isInstagramAuth = false;

  $ionicPlatform.ready(function() {
    if (TwitterService.isAuthenticated()) {
      $scope.showLogin = false;
      console.log('is Authenticated');
    }
    Parse.Cloud.run('isInstagramAuth', {}, {
      success: function(response) {
        if (response) {
          $scope.isInstagramAuth = true;
        }
      },
      error: function(error) {
        console.log(error);
      }
    });
  });

  $scope.instagramUser = '';

  Parse.Cloud.run('getInstagramData', {}, {
    success: function(response) {
      $scope.instagramUser = response.data.username;
      $scope.$apply();
    },
    error: function(error) {
      console.log(error);
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
  };

  $scope.authenticateInstagram = function() {
    if (Parse.User.current()) {
      var currentSession = Parse.Session.current()
      .then(function(session) {
        var ref = window.open('https://gisttortrip.parseapp.com/authorize?sessionId=' + session.id, '_system', 'location=yes');
        ref.addEventListener('loaderror', function(error) {
          console.log(error);
        })
      });
    } else {
      alert('You must be logged in!');
    }
  };

  $scope.logout = function() {
    console.log('logout');
    Parse.User.logOut();
    var currentUser = Parse.User.current();
    if (currentUser) {
        $scope.user = currentUser;
    } else {
        $scope.user = 'no user'
    }
    console.log($scope.user);
  }
  
});
