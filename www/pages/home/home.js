angular.module('page.home', ['tripCards', 'ionic'])
.controller('HomeCtrl', function($scope, $q, $state, $rootScope, $cordovaCamera, $ionicModal, $ionicPlatform, TwitterService) {
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
      var obj = {
        type: 'image',
        img_url: img,
        date: new Date(),
        location: 'here'
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
    $scope.twitter.remove();
  });


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
    var postTweet = TwitterService.postTweet($scope.twitter.tweet, function(res) {
      console.log(res);
      var obj = {
        type: 'tweet',
        user: res.user.name,
        profile_img: res.user.profile_image_url_https,
        text: res.text,
        date: res.created_at,
        location: 'there',
        id: res.id
      };
      $rootScope.$broadcast('tweetPosted', obj);
    });
    $scope.closeTwitterModal();
  };
  $scope.closeTwitterModal = function() {
    $scope.twitter.hide();
    $scope.twitter.tweet = '';
  };

});
