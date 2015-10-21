angular.module('page.home', ['tripCards', 'ionic'])
.controller('HomeCtrl', function($scope, $q, $rootScope, $ionicModal) {
  
  $scope.takePicture = function() {
    var defer = $q.defer();
    defer.promise.then(function(img) {
      var obj = {
        type: 'image',
        img_url: img,
        date: new Date(),
        location: 'here'
      };
      $rootScope.$broadcast('pictureTaken', obj);
    });

    navigator.camera.getPicture(defer.resolve, defer.reject, {
      quality: 75,
      encodingType: Camera.EncodingType.JPEG,
      correctOrientation: true,
      saveToPhotoAlbum: false
    });
  };

  $ionicModal.fromTemplateUrl('pages/home/make-note.tpl.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });

  $scope.saveNote = function() {
    $scope.modal.hide();
  };
  $scope.makeNote = function() {
    $scope.modal.show();
  };
  $scope.closeModal = function() {
    $scope.modal.hide();
  };

});
