angular.module('page.home', ['tripCards'])
  .controller('HomeCtrl', function($scope, $q, $rootScope) {
    
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
  });
