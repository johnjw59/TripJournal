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

  describe('$scope.buildPath', function() {
  	it('builds a path from markers', function() {
  		var markers = [
  			{location: {latitude: 1,longitude: 1}, other: 'other'},
  			{location: {latitude: 2,longitude: 2}, other: 'other'},
  			{location: {latitude: 3,longitude: 3}, other: 'other'},
  			{location: {latitude: 4,longitude: 4}, other: 'other'}
  		];

  		var expectedPath = [
  			[1,1],
  			[2,2],
  			[3,3],
  			[4,4]
  		];

  		var $scope = $rootScope.$new();
      	var controller = $controller(MapViewController, { 
        	$scope: $scope, 
        	$stateParams: $stateParams 
      	});
      	$scope.$apply();

  		$scope.path = $scope.buildPath(markers);
  		expect($scope.path).toEqual(expectedPath);
  	});
  });
});