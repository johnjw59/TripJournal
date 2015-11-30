describe('TripCtrl', function() {
  beforeEach(module('ngCordova'));
  beforeEach(module('ngCordovaMocks'));
  beforeEach(module('ngTwitter'));
  beforeEach(module('ngResource'));
  beforeEach(module('service.geolocation'));
  beforeEach(module('TwitterService'));
  beforeEach(module('page.trip'));

  var $controller;
  var $rootScope;
  var $q;

  var $scope;
  var controller;

  beforeEach(inject(function(_$rootScope_, _$controller_, _$q_) {
    $controller = _$controller_;
    $rootScope = _$rootScope_;
    $q = _$q_;

    
  }));

  describe('$scope.changeView', function() {
    it('changes tab between "cards" and "map"', function() {
      var $scope = $rootScope.$new();
      var CardsService = {getTrip: function() {
          var deferred = $q.defer();
          deferred.resolve([{text: 'asdf'}]);
          return deferred.promise;
        }
      }
      var controller = $controller('TripCtrl', { 
        $scope: $scope,
        $stateParams: {id:1},
        $ionicLoading: {show: function(obj) {}},
        CardsService: CardsService
      });
      $scope.tab = 'cards';
      $scope.changeView();
      expect($scope.tab).toEqual('map');
      $scope.changeView();
      expect($scope.tab).toEqual('cards');
    });
  });

});
