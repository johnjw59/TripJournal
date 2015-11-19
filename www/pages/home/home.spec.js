describe('HomeCtrl', function() {
  beforeEach(module('ngCordova'));
  beforeEach(module('ngCordovaMocks'));
  beforeEach(module('ngTwitter'));
  beforeEach(module('ngResource'));
  beforeEach(module('service.geolocation'));
  beforeEach(module('TwitterService'));
  beforeEach(module('page.home'));

  var $controller;
  var $rootScope;

  beforeEach(inject(function(_$rootScope_, _$controller_) {
    $controller = _$controller_;
    $rootScope = _$rootScope_;
  }));

  describe('$scope.changeView', function() {
    it('changes tab between "cards" and "map"', function() {
      var $scope = $rootScope.$new();
      var controller = $controller('HomeCtrl', { $scope: $scope });
      $scope.tab = 'cards';
      $scope.changeView();
      expect($scope.tab).toEqual('map');
      $scope.changeView();
      expect($scope.tab).toEqual('cards');
    });
  });

});
