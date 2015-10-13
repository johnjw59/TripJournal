angular.module('page.home', [])
  .controller('HomeCtrl', function ($scope, $q) {
    var defer = $q.defer();
    defer.promise.then(function (img) {
      $scope.img = img;
    });

    $scope.takePicture = function () {
      navigator.camera.getPicture(defer.resolve, defer.reject, {
        quality: 75,
        encodingType: Camera.EncodingType.JPEG,
        correctOrientation: true,
        saveToPhotoAlbum: false
      });
    };
  });
