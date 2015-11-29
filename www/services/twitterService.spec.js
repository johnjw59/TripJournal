describe('TwitterService', function() {
  beforeEach(module('ngCordova'));
  beforeEach(module('ngCordovaMocks'));
  beforeEach(module('ngTwitter'));
  beforeEach(module('ngResource'));
  beforeEach(module('service.geolocation'));
  beforeEach(module('TwitterService'));
  beforeEach(module('page.home'));

  // beforeEach(inject(function(_$rootScope_, _$controller_) {
  //   $controller = _$controller_;
  //   $rootScope = _$rootScope_;
  // }));
  
  var TwitterService;
  
  beforeEach(function(){
    module('app');
    inject(function($injector){
      TwitterService = $injector.get('TwitterService');
    });
  });

  describe('Store tokens', function() {
    it('stores tokens correctly', function() {
      var token = {token: 'some_token'};
      TwitterService.storeUserToken(token);
      expect(JSON.parse(TwitterService.getStoredToken())).toEqual(token);
    });
  });

  describe('Is authenticated', function() {
    it('is authenticated if you have token', function() {
      var token = {token: 'some_token'};
      TwitterService.storeUserToken(token);
      expect(TwitterService.isAuthenticated()).toEqual(true);
    });
  });

  describe('Initializes', function() {
    it('initializes correctly if you have token', function() {
      var token = {token: 'some_token'};
      TwitterService.storeUserToken(token);
      TwitterService.initialize().then(function(res) {
        expect(res.value).toEqual(true);
      });
      TwitterService.configure();
    });
  });

});
