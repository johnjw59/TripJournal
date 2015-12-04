describe('NewTripCtrl', function() {
  beforeEach(module('service.cards'));
  beforeEach(module('page.newTrip'));

  var $controller;
  var $rootScope;
  var $ionicHistory;
  var CardsService;
  var $state;

  beforeEach(inject(function($injector) {
    $controller = $injector.get('$controller');
    $rootScope = $injector.get('$rootScope');
    $ionicHistory = $injector.get('$ionicHistory');
    CardsService = $injector.get('CardsService');
    $state = $injector.get('$state');
  }));

  afterEach(inject(function() {
    window.localStorage.clear();
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

    it('should go to login if there is no user', function() {
      spyOn($state, 'go').and.callFake(function(arg) { 
        expect(arg).toEqual('login');
      });
      spyOn(Parse.User, 'current').and.callFake(function() {
        return null;
      })

      var $scope = $rootScope.$new();
      var controller = $controller('NewTripCtrl', { $scope: $scope });
    });

    it('should go home if a trip is set already', function() {
      window.localStorage.setItem('trip_id', '1234');
      spyOn($state, 'go');

      var $scope = $rootScope.$new();
      var controller = $controller('NewTripCtrl', { $scope: $scope });
      
      expect($state.go).toHaveBeenCalledWith('home');
    });
  });

  describe('Starting a new trip', function() {
    it('should save id to local storage', function() {
      var $scope = $rootScope.$new();
      var controller = $controller('NewTripCtrl', { $scope: $scope });
      $scope.$apply();

      spyOn($state, 'go');
      spyOn(localStorage, 'setItem');
      $scope.startTrip();
      expect(localStorage.setItem).toHaveBeenCalledWith('trip_id', '1234');
    });
  });

});
