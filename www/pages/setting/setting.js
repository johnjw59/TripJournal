angular.module('page.setting', [])
.controller("SettingCtrl", function($scope, $state, $timeout, $ionicPlatform, $ionicHistory, $ionicLoading, $ionicPopup, TwitterService) {
  $scope.$state = $state;

  // Only show end trip button if I'm on a trip
  $scope.$on('$ionicView.enter', function() {
    $scope.on_trip = (window.localStorage.getItem('trip_id') === null) ? false : true;
  });

  $scope.endTrip = function() {
    var confirmPopup = $ionicPopup.confirm({
      title: 'End Current Trip?',
      template: 'Are you sure you want to end this trip? You will no longer be able to post new cards to it.'
    });
    confirmPopup.then(function(res) {
      if(res) {
        $ionicLoading.show({
          template: 'Ending your trip...'
        });
        var ParseTrip = Parse.Object.extend("Trip");
    
        var trip = new ParseTrip();
        trip.id = window.localStorage.getItem('trip_id');
        trip.set('end', new Date());
        
        trip.save(null, {
          success: function(ret) {
            window.localStorage.removeItem('trip_id');
            $timeout(function(){$ionicLoading.hide();},100);
            $state.go('new-trip');
          },
          error: function(err) {
            console.error(err);
          }
        });
      }
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
      console.log('is Authenticated');
    } else {
      console.log('not Authenticated');
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

  $scope.getPhotos = function() {
    Parse.Cloud.run('getInstagramPhotos', {}, {
      success: function(response) {
        response.data.forEach(function(item) {
          var location;
          if (item.location) {
            location = {
              latitude: item.latitude,
              longitude: item.longitude
            }
          } else {
            location = {
              latitude: '',
              longitude: ''
            };
          }
          var obj = {
            type: 'instagram',
            data: {img_url: item.images.standard_resolution.url},
            createdAt: new Date(item.caption.created_time),
            location: location
          };
          $scope.$emit('newCard', obj);
          console.log(response);
        });
        
      },
      error: function(error) {
        console.log(error);
      }
    });
  }
  
  // enable for debugging
  // $scope.logOut = function() {
  //   Parse.User.logOut();
  //   $state.go('login');
  // }

});
