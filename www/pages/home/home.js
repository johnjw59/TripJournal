angular.module('page.home', ['tripCards', 'ionic'])
.controller('HomeCtrl', function($scope, $q, $state, $rootScope, $cordovaCamera, $ionicModal, $ionicPopup) {
  $scope.$state = $state;
  
  $scope.takePicture = function() {
    var options = {
      quality: 75,
      encodingType: Camera.EncodingType.JPEG,
      correctOrientation: true,
      saveToPhotoAlbum: false
    };

    $cordovaCamera.getPicture(options)
    .then(function(img) {
      //to test popup after login, uncomment below line (it's not working right now)
      //window.localStorage.removeItem('google_access_token');
      //temp get token from local storage
      var access_token = window.localStorage.getItem('google_access_token');
      if (access_token === null) {
        $scope.showAlert = function() {
          $ionicPopup.alert({
            title: 'Authentication Required',
            template: 'Please login to Google in Settings'
          }).then(function(res) {
            if (res) {
              $state.go('setting');
            }
          });
        };
      } else {
        //TODO - upload img to Drive, broadcast drive url
        var obj = {
          type: 'image',
          img_url: img,
          date: new Date(),
          location: 'here'
        };
        $rootScope.$broadcast('pictureTaken', obj);
      }
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
      location: 'there'
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
