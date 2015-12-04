describe('LoginCtrl', function() {
  beforeEach(module('ngCordova'));
  beforeEach(module('ngCordovaMocks'));
  beforeEach(module('ngTwitter'));
  beforeEach(module('ngResource'));
  beforeEach(module('service.geolocation'));
  beforeEach(module('service.cards'));
  beforeEach(module('ui.router'));
  beforeEach(module('page.login'));

  var $controller;
  var $rootScope;
  var $state;
  var $ionicLoading;
  var CardsService;

  beforeEach(inject(function($injector) {
    $controller = $injector.get('$controller');
    $rootScope = $injector.get('$rootScope');
    $state = {go: function(route) {return true;}}
    $ionicLoading = {
      show: function(message) {return true;},
      hide: function() {return true;}
    };
    CardsService = $injector.get('CardsService');

    spyOn(Parse, 'User').and.returnValue({
      set: function(param, value) {
        this[param] = value;
      },
      signUp: function(something, callbacks) {
        if (this.username.indexOf('@') === -1) {
          return callbacks.error(this.username, 'Not a valid email');
        }
        return callbacks.success('user');
      }
    });

    spyOn(CardsService, 'refreshId');
    spyOn(window, 'alert');

  }));

  describe('$scope.register', function() {
    it('registers new user', function() {
      var $scope = $rootScope.$new();
      var controller = $controller('LoginCtrl', {
        $scope: $scope,
        $state: $state
      });
      $scope.email = 'a@b.c';
      $scope.password = 'pass';
      $scope.register();
      expect(CardsService.refreshId).toHaveBeenCalled();
    });
  });

  describe('$scope.register', function() {
    it('tries to registers new user with an unvalid email', function() {
      var $scope = $rootScope.$new();
      var controller = $controller('LoginCtrl', {
        $scope: $scope,
        $state: $state
      });
      $scope.email = 'ab.c';
      $scope.password = 'pass';
      $scope.register();
      expect(window.alert).toHaveBeenCalled();
    });
  });


});
