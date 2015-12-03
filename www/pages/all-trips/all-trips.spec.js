describe('AllTripsCtrl', function() {
  beforeEach(module('service.cards'));
  beforeEach(module('page.allTrips'));

  var $controller;
  var $rootScope;
  var $state;

  beforeEach(inject(function($injector) {
    $controller = $injector.get('$controller');
    $rootScope = $injector.get('$rootScope');
    $state = $injector.get('$state');
  }));

  describe('Entering View', function() {
    it('should redirect if no user', function() {
      spyOn($state, 'go').and.callFake(function(arg) { 
        expect(arg).toEqual('login');
      });
      spyOn(Parse.User, 'current').and.callFake(function() {
        return null;
      })

      var $scope = $rootScope.$new();
      var controller = $controller('AllTripsCtrl', { $scope: $scope });
    });
  });
  
});
