describe('TripCtrl', function() {
  beforeEach(module('ngCordova'));
  beforeEach(module('ngCordovaMocks'));
  beforeEach(module('service.geolocation'));
  beforeEach(module('service.cards'));
  beforeEach(module('page.trip'));

  var $controller;
  var $rootScope;
  var CardsService;
  var $stateParams;

  beforeEach(inject(function($injector) {
    $controller = $injector.get('$controller');
    $rootScope = $injector.get('$rootScope');
    CardsService = $injector.get('CardsService');
    $stateParams = $injector.get('$stateParams');
  }));

  describe('$scope.changeView', function() {
    it('changes tab between "cards" and "map"', function() {
      var $scope = $rootScope.$new();
      var controller = $controller('TripCtrl', { $scope: $scope });
      $scope.tab = 'cards';
      $scope.changeView();
      expect($scope.tab).toEqual('map');
      $scope.changeView();
      expect($scope.tab).toEqual('cards');
    });
  });

  describe('trip ID', function() {
    it('should be retrieved from the url', function() {
      $stateParams = {id: '1234'};
      var $scope = $rootScope.$new();
      var controller = $controller('TripCtrl', { 
        $scope: $scope, 
        $stateParams: $stateParams 
      });
      $scope.$apply();

      expect($scope.tripId).toEqual('1234');
    });
  })

});
