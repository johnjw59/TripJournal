angular.module('page.home', ['tripCards', 'mapview', 'ngGPlaces',  'ngCordova', 'ionic'])
.controller('HomeCtrl', function($scope, $state, $cordovaCamera, $ionicModal, $ionicTabsDelegate, $ionicHistory, ngGPlacesAPI, GeolocationService, TwitterService) {
  $scope.$state = $state;

  // Set default tab on view load
  $scope.$on('$ionicView.enter', function() {
    // Clear history on entering so we don't get weird back button issues
    $ionicHistory.clearHistory();

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
  

  // Place chooser functionality. Responsible for event broadcasting
  $ionicModal.fromTemplateUrl('pages/home/places.tpl.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.placesModal = modal;
    $scope.placesModal.places = [];
  });
  $scope.openPlaces = function(obj) {
    $scope.placesModal.card = obj.card;
    $scope.placesModal.places = obj.places;

    if (obj.places.length > 1) {
      $scope.placesModal.show();
    } else {
      $scope.choosePlace(obj.places[0]);
    }
  };
  $scope.choosePlace = function(place) {
    $scope.placesModal.card.locationName = place.name;
    
    // This is the newCard event that triggers a Parse save
    $scope.$emit('newCard', $scope.placesModal.card);
    $scope.closeModal();
  };


  // Camera taking functionality
  $scope.takePicture = function() {
    var options = {
      quality: 75,
      encodingType: Camera.EncodingType.JPEG,
      correctOrientation: true,
      saveToPhotoAlbum: false
    };
    $cordovaCamera.getPicture(options)
    .then(function(img) {
      GeolocationService.places()
      .then(function(places) {
        var obj = {
          card: {
            type: 'image',
            data: {img_url: img},
            createdAt: new Date(),
            location: {
              latitude: places.loc.lat,
              longitude: places.loc.lon
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
        card: {
          type: 'note',
          data: {text: $scope.noteModal.note} ,
          createdAt: new Date(),
          location: {
            latitude: places.loc.lat,
            longitude: places.loc.lon
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
          card: {
            type: 'tweet',
            data: {
              user: res.user.name,
              profile_img: res.user.profile_image_url_https,
              tweet: res.text,
            },
            createdAt: new Date(res.created_at),
            location: {
              latitude: places.loc.lat,
              longitude: places.loc.lon
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
        card: {
          type: 'checkin',
          createdAt: new Date(),
          location: {
            latitude: places.loc.lat,
            longitude: places.loc.lon
          }
        },
        places: places
      };
      $scope.openPlaces(obj);
    });
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
