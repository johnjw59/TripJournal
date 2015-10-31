angular.module('page.home', ['tripCards', 'mapview', 'ngGPlaces',  'ngCordova', 'ionic'])
.controller('HomeCtrl', function($scope, $q, $state, $rootScope, $cordovaCamera, $ionicModal, $ionicTabsDelegate, ngGPlacesAPI, GeolocationService) {
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

        $rootScope.$broadcast('pictureTaken', obj);
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

      $rootScope.$broadcast('noteMade', obj);
      $scope.closeModal();
    });
  };
  $scope.closeModal = function() {
    $scope.modal.hide();
    $scope.modal.note = '';
  };


  // Cleanup modal.
  $scope.$on('$destroy', function() {
    $scope.modal.remove();
  });

});
