describe('DetailCtrl', function() {
  beforeEach(module('page.detail'));

  var $controller;
  var $rootScope;
  var $state;
  var $stateParams;

  beforeEach(inject(function($injector) {
    $controller = $injector.get('$controller');
    $rootScope = $injector.get('$rootScope');
    $state = {};
    $stateParams = {};

  }));

  describe('$scope', function() {
    it('does very little...', function() {
      var $scope = $rootScope.$new();
      var controller = $controller('DetailCtrl', {
        $scope: $scope,
        $state: $state,
        $stateParams: $stateParams
      });
    });
  });
});
