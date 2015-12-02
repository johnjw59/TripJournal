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
  var $ionicHistory;
  var $httpBackend;
  var GeolocationService;

  beforeEach(inject(function($injector) {
    $controller = $injector.get('$controller');
    $rootScope = $injector.get('$rootScope');
    $ionicHistory = $injector.get('$ionicHistory');
    GeolocationService = $injector.get('GeolocationService');
    $ionicModal = $injector.get('$ionicModal');

    $httpBackend = $injector.get('$httpBackend');
    $httpBackend.whenGET('pages/home/places.tpl.html').respond(200, '');
    $httpBackend.whenGET('pages/home/make-note.tpl.html').respond(200, '');
    $httpBackend.whenGET('pages/home/tweet.tpl.html').respond(200, '');

    // Hack to emulate a promise
    spyOn(GeolocationService, 'places').and.callFake(function() {
      return {
        then: function(callback) {
          return callback({
            data: [{name: 'place'}],
            loc: {lat: 1, lon: 2}
          });
        }
      };
    });
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

  describe('Entering View', function() {
    it('should clear ionicHistory', function() {
      var $scope = $rootScope.$new();
      var controller = $controller('HomeCtrl', { $scope: $scope });
      $scope.$apply();

      spyOn($ionicHistory, 'clearHistory');
      $rootScope.$broadcast('$ionicView.enter');
      expect($ionicHistory.clearHistory).toHaveBeenCalled();
    });
  });

  describe('Making a note', function() {
    it('should send correctly formated data to openPlaces()', function() {
      var $scope = $rootScope.$new();
      var controller = $controller('HomeCtrl', { $scope: $scope });
      $scope.$apply();

      $scope.noteModal = {
        note: 'note',
        hide: function() {
          return {
            then: function(callback) {
              return callback();
            }
          };
        }
      };

      spyOn($scope, 'openPlaces');
      $scope.saveNote();
      var obj = $scope.openPlaces.calls.mostRecent().args[0];

      expect(obj.card.type).toEqual('note');
      expect(obj.card.data).toEqual({text: 'note'});
      expect(obj.card.location).toEqual({latitude: 1, longitude: 2});
    });
  });

  describe('Checking In', function() {
    it('should send correctly formated data to openPlaces()', function() {
      var $scope = $rootScope.$new();
      var controller = $controller('HomeCtrl', { $scope: $scope });
      $scope.$apply();

      spyOn($scope, 'openPlaces');
      $scope.checkin();
      var obj = $scope.openPlaces.calls.mostRecent().args[0];

      expect(obj.card.type).toEqual('checkin');
      expect(obj.card.location).toEqual({latitude: 1, longitude: 2});
    });
  });

  describe('choosePlace', function() {
    it('should add place to card and fire newCard event', function() {
      var $scope = $rootScope.$new();
      var controller = $controller('HomeCtrl', { $scope: $scope });

      $scope.noteModal = {
        hide: function() { return; }
      };
      $scope.twitterModal = {
        hide: function() { return; }
      };
      $scope.placesModal = {
        card: { locationName: ''},
        hide: function() {return;}
      };

      var eventEmitted;
      $rootScope.$on("newCard", function() {
         eventEmitted = true;
      });
      
      $scope.choosePlace({name: 'place'});
      expect($scope.placesModal.card.locationName).toEqual('place');      
      expect(eventEmitted).toBe(true);
    });
  });

});
