describe('NewTripCtrl', function() {
  beforeEach(module('service.cards'));
  beforeEach(module('page.newTrip'));

  var $controller;
  var $rootScope;
  var $ionicHistory;
  var CardsService;

  beforeEach(inject(function($injector) {
    $controller = $injector.get('$controller');
    $rootScope = $injector.get('$rootScope');
    $ionicHistory = $injector.get('$ionicHistory');
    CardsService = $injector.get('CardsService');


  }));

  describe('Entering View', function() {
    it('should clear ionicHistory', function() {
      var $scope = $rootScope.$new();
      var controller = $controller('NewTripCtrl', { $scope: $scope });
      $scope.$apply();

      spyOn($ionicHistory, 'clearHistory');
      spyOn($ionicHistory, 'clearCache');
      $rootScope.$broadcast('$ionicView.enter');
      expect($ionicHistory.clearHistory).toHaveBeenCalled();
      expect($ionicHistory.clearCache).toHaveBeenCalled();
    });
  });

});
