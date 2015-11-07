angular.module('page.home', ['tripCards', 'mapview', 'ngGPlaces',  'ngCordova', 'ionic'])
.controller('HomeCtrl', function($scope, $q, $state, $cordovaCamera, $ionicModal, $ionicTabsDelegate, $ionicPlatform, ngGPlacesAPI, GeolocationService, TwitterService) {
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
          type: 'image',
          img_url: img,
          date: new Date(),
          loc_coords: {
            lat: places.loc.lat,
            lon: places.loc.lon
          },
          loc_name: places[0].name
        };

        $scope.$emit('newCard', obj);
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
        type: 'note',
        text: $scope.noteModal.note,
        date: new Date(),
        loc_coords: {
          lat: places.loc.lat,
          lon: places.loc.lon
        },
        loc_name: places[0].name
      };

      $scope.$emit('newCard', obj);
      $scope.closeModal();
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
          type: 'tweet',
          user: res.user.name,
          profile_img: res.user.profile_image_url_https,
          text: res.text,
          date: new Date(res.created_at),
          loc_coords: {
            lat: places.loc.lat,
            lon: places.loc.lon
          },
          loc_name: places[0].name
        };
        $scope.$emit('newCard', obj);
        $scope.closeModal();
      });
    });
  };

  //Check-in functionality
  $scope.checkin = function() {
    GeolocationService.places()
    .then(function(places) {
      var obj = {
        type: 'checkin',
        date: new Date(),
        loc_coords: {
          lat: places.loc.lat,
          lon: places.loc.lon
        },
        loc_name: places[0].name
      };

      $scope.$emit('newCard', obj);
    });
  };


  // General modal functions
  $scope.closeModal = function() {
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
