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
  
  // Camera
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


  // Note taking Modal
  $ionicModal.fromTemplateUrl('pages/home/make-note.tpl.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
    $scope.modal.note = '';
  });
  $scope.makeNote = function() {
    $scope.modal.show()
    .then(function() {
      document.getElementById('make-note').focus();
    });
  };
  $scope.saveNote = function() {
    GeolocationService.places()
    .then(function(places) {
      var obj = {
        type: 'note',
        text: $scope.modal.note,
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
  $scope.closeModal = function() {
    $scope.modal.hide();
    $scope.modal.note = '';
  };


  $ionicModal.fromTemplateUrl('pages/home/tweet.tpl.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.twitter = modal;
    $scope.twitter.tweet = '';
  });

  $scope.openTwitter = function() {
    $scope.twitter.show()
    .then(function() {
      document.getElementById('tweet').focus();
    });
  };
  $scope.postTweet = function() {
    TwitterService.postTweet($scope.twitter.tweet, function(res) {
      console.log(res);
      GeolocationService.places()
      .then(function(places) {
        var obj = {
          type: 'tweet',
          user: res.user.name,
          profile_img: res.user.profile_image_url_https,
          text: res.text,
          date: res.created_at,
          loc_coords: {
            lat: places.loc.lat,
            lon: places.loc.lon
          },
          loc_name: places[0].name
        };
        $scope.$emit('newCard', obj);
        $scope.closeTwitterModal();
      });
    });
    
  };
  $scope.closeTwitterModal = function() {
    $scope.twitter.hide();
    $scope.twitter.tweet = '';
  };


 // Cleanup modal.
  $scope.$on('$destroy', function() {
    $scope.modal.remove();
    $scope.twitter.remove();
  });

});
