describe('SignupCtrl', function() {
  beforeEach(module('ngCordova'));
  beforeEach(module('ngCordovaMocks'));
  beforeEach(module('ngTwitter'));
  beforeEach(module('ngResource'));
  beforeEach(module('service.geolocation'));
  beforeEach(module('TwitterService'));
  beforeEach(module('ui.router'));
  beforeEach(module('page.signup'));

  var $controller;
  var $rootScope;
  var $state;

  beforeEach(inject(function(_$rootScope_, _$controller_, _$state_) {
    $controller = _$controller_;
    $rootScope = _$rootScope_;
    $state = _$state_;
  }));

  describe('$scope.reset', function() {
    it('sets current user to none', function() {
      var $scope = $rootScope.$new();
      var controller = $controller('SignupCtrl', {$scope: $scope, $state: $state});
      $scope.user = 'John';
      $scope.reset();
      expect($scope.user).toEqual({});
    });
  });

});
