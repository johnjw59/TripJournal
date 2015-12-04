describe('mapview', function() {
  var $controller;
  var $rootScope;
  var $httpBackend;
  var $state;
  var $stateParams;

  beforeEach(module('mapview'));
  beforeEach(module('ngCordova'));
  beforeEach(module('ngCordovaMocks'));
  beforeEach(module('ngResource'));
  beforeEach(module('page.home'));

  beforeEach(inject(function($injector) {
    $controller = $injector.get('$controller');
    $rootScope = $injector.get('$rootScope');
    $httpBackend = $injector.get('$httpBackend');
    $state = $injector.get('$state');
    $stateParams = $injector.get('$stateParams');
    $httpBackend.whenGET('pages/detail/detail.tpl.html').respond(200, '');
    $httpBackend.whenGET('components/mapview/mapview.tpl.html').respond(200, '');
  }));

  describe('$scope.tripId param', function() {
    it('gets correct trip id through url param', function() {
      var tripId = '1';
      $stateParams = {id: tripId};
      var $scope = $rootScope.$new();
      var controller = $controller(MapViewController, { 
        $scope: $scope, 
        $stateParams: $stateParams 
      });
      $scope.$apply();
      expect(tripId, $scope.tripId);
    });
  });
   
  describe('$scope.detail', function() {
    it('navigates to detail page of the marker', function() {
      spyOn($state, 'go').and.callFake(function(arg1,arg2) { 
        expect(arg1).toEqual('detail');
        expect(arg2).toEqual({card: card});
      });

      $stateParams = {id: '1'};
      var $scope = $rootScope.$new();
      var controller = $controller(MapViewController, { 
        $scope: $scope, 
        $stateParams: $stateParams 
      });
      $scope.$apply();

      var e = {type: 1};
      var card = {type: 'note'};

      $scope.detail(e,card);
    });
  });
});