describe('SettingCtrl', function() {
  beforeEach(module('ngCordova'));
  beforeEach(module('ngCordovaMocks'))
  beforeEach(module('ngTwitter'));
  beforeEach(module('ngResource'));
  beforeEach(module('service.cards'));
  beforeEach(module('TwitterService'));
  beforeEach(module('page.setting'));

  var $controller;
  var $rootScope;
  var $ionicPopup;
  var $state;
  var $q;

  beforeEach(inject(function($injector) {
    $controller = $injector.get('$controller');
    $rootScope = $injector.get('$rootScope');
    $ionicPopup = $injector.get('$ionicPopup');
    $state = $injector.get('$state');
    $q = $injector.get('$q');

  }));

  afterEach(inject(function() {
    window.localStorage.clear();
  }));

  describe('End Trip', function() {
    it('should only be visible if you have a set trip', function() {
      var $scope = $rootScope.$new();
      var controller = $controller('SettingCtrl', { $scope: $scope });

      $rootScope.$broadcast('$ionicView.enter');
      expect($scope.on_trip).not.toBeTruthy();

      window.localStorage.setItem('trip_id', '1234');
      $rootScope.$broadcast('$ionicView.enter');
      expect($scope.on_trip).toBeTruthy();
    });

    it('should redirect to new-trip page if used', function() {
      window.localStorage.setItem('trip_id', '1234');
      var $scope = $rootScope.$new();
      var controller = $controller('SettingCtrl', { $scope: $scope });

      spyOn($state, 'go');
      spyOn($ionicPopup, 'confirm').and.callFake(function() {
        return {
          then: function(callback) { return callback(true); }
        };
      });

      $scope.endTrip();
      expect($state.go).toHaveBeenCalledWith('new-trip');
    });
  });

});
