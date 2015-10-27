angular.module('page.home', [
  'tripCards',
  'mapview',
  'ngGPlaces', 
  'ngCordova',
  'ionic'
])
.config(function(ngGPlacesAPIProvider){
  ngGPlacesAPIProvider.setDefaults({
    radius:1
  });
})
.controller('HomeCtrl', function($scope, $q, $state, $rootScope, $cordovaCamera, $ionicModal, ngGPlacesAPI, GeolocationService) {
  $scope.$state = $state;
  $scope.tab = 'cards';   

  $scope.changeView = function() {
    $scope.tab = ($scope.tab == 'cards') ? 'map' : 'cards';
  };
  
  $scope.takePicture = function() {
    var options = {
      quality: 75,
      encodingType: Camera.EncodingType.JPEG,
      correctOrientation: true,
      saveToPhotoAlbum: false
    };

    $cordovaCamera.getPicture(options)
    .then(function(img) {
      var obj = {
        type: 'image',
        img_url: img,
        date: new Date(),
        location: 'there'
      };
      $rootScope.$broadcast('pictureTaken', obj);
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
    var obj = {
      type: 'note',
      text: $scope.modal.note,
      date: new Date(),
      location: 'here'
    };
    $rootScope.$broadcast('noteMade', obj);

    $scope.closeModal();
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
