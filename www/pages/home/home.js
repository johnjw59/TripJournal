angular.module('page.home', ['tripCards', 'mapview', 'ngGPlaces',  'ngCordova', 'ionic'])
.controller('HomeCtrl', function($scope, $q, $state, $cordovaCamera, $ionicModal, $ionicPopup, $ionicTabsDelegate, $ionicPlatform, ngGPlacesAPI, GeolocationService, TwitterService) {
  $scope.$state = $state;

  // Set default tab on view load
  $scope.$on('$ionicView.enter', function() {
    if ($scope.tab == 'map') {
      $ionicTabsDelegate.select(1);
      $scope.tab = 'map';
    }
    else {
      $ionicTabsDelegate.select(0);
      $scope.tab = 'cards';
    }
  });
  $scope.changeView = function() {
    $scope.tab = ($scope.tab == 'cards') ? 'map' : 'cards';
  };

  // Camera taking functionality
  $scope.takePicture = function() {
    //to test popup after login, uncomment below line
    //window.localStorage.removeItem('google_access_token');
    //temp get token from local storage
    var access_token = window.localStorage.getItem('google_access_token');
    if (access_token === null) {
      $ionicPopup.alert({
        title: 'Authentication Required',
        template: 'Click OK to Login'
      }).then(function(res) {
        if (res) {
          $state.go('setting');
        }
      });
    } else {
      var options = {
        quality: 75,
        encodingType: Camera.EncodingType.JPEG,
        correctOrientation: true,
        saveToPhotoAlbum: false
      };
      //TODO - upload img to Drive, broadcast drive url
      $cordovaCamera.getPicture(options)
      .then(function(img) {
        GeolocationService.places()
        .then(function(places) {
          var obj = {
            data: {
              type: 'image',
              img_url: img,
              date: new Date(),
              loc_coords: {
                lat: places.loc.lat,
                lon: places.loc.lon
              }
            },
            places: places
          };
          $scope.openPlaces(obj);
        });
      }, function(err) {
        console.error(err);
      });
    };
  }

  // Note taking modal
  $ionicModal.fromTemplateUrl('pages/home/make-note.tpl.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.noteModal = modal;
    $scope.noteModal.note = '';
  });
  $scope.makeNote = function() {
    $scope.noteModal.show()
    .then(function() {
      document.getElementById('make-note').focus();
    });
  };
  $scope.saveNote = function() {
    GeolocationService.places()
    .then(function(places) {
      var obj = {
        data: {
          type: 'note',
          text: $scope.noteModal.note,
          date: new Date(),
          loc_coords: {
            lat: places.loc.lat,
            lon: places.loc.lon
          }
        },
        places: places
      };
      $scope.noteModal.hide()
      .then(function() {
        $scope.openPlaces(obj);
      });
    });
  };


  // Tweet making modal
  $ionicModal.fromTemplateUrl('pages/home/tweet.tpl.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.twitterModal = modal;
    $scope.twitterModal.tweet = '';
  });
  $scope.openTwitter = function() {
    $scope.twitterModal.show()
    .then(function() {
      document.getElementById('tweet').focus();
    });
  };
  $scope.postTweet = function() {
    TwitterService.postTweet($scope.twitterModal.tweet, function(res) {
      console.log(res);
      GeolocationService.places()
      .then(function(places) {
        var obj = {
          data: {
            type: 'tweet',
            user: res.user.name,
            profile_img: res.user.profile_image_url_https,
            text: res.text,
            date: new Date(res.created_at),
            loc_coords: {
              lat: places.loc.lat,
              lon: places.loc.lon
            }
          },
          places: places
        };
        $scope.twitterModal.hide()
        .then(function() {
         $scope.openPlaces(obj);
       });
      });
    });
  };


  // Check-in functionality
  $scope.checkin = function() {
    GeolocationService.places()
    .then(function(places) {
      var obj = {
        data: {
          type: 'checkin',
          date: new Date(),
          loc_coords: {
            lat: places.loc.lat,
            lon: places.loc.lon
          }
        },
        places: places
      };
      $scope.openPlaces(obj);
    });
  };


  // Place chooser functionality. Responsible for event broadcasting
  $ionicModal.fromTemplateUrl('pages/home/places.tpl.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.placesModal = modal;
    $scope.placesModal.places = [];
  });
  $scope.openPlaces = function(obj) {
    $scope.placesModal.data = obj.data;
    $scope.placesModal.places = obj.places;

    if (obj.places.length > 1) {
      $scope.placesModal.show();
    } else {
      $scope.choosePlace(obj.places[0]);
    }
  };
  $scope.choosePlace = function(place) {
    $scope.placesModal.data.loc_name = place.name;
    $scope.$emit('newCard', $scope.placesModal.data);
    $scope.closeModal();
  };


  // General modal functions
  $scope.closeModal = function() {
    $scope.placesModal.hide();

    $scope.noteModal.hide();
    $scope.noteModal.note = '';

    $scope.twitterModal.hide();
    $scope.twitterModal.tweet = '';
  };
  $scope.$on('$destroy', function() {
    $scope.modal.remove();
    $scope.twitter.remove();
  });

});
