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
  var $cordovaOauth;
  var $twitterApi;
  var $q;
  
  beforeEach(inject(function($injector){
      TwitterService = $injector.get('TwitterService');
      $cordovaOauth = $injector.get('$cordovaOauth');
      $twitterApi = $injector.get('$twitterApi');
      $q = $injector.get('$q');
      spyOn($cordovaOauth, 'twitter').and.callFake(function(clientId, clientSecret) {
        return {
          then: function(callback, errorCallback) {
            if (clientId !== 'asdf') {
              return callback({
                data: {token: 'some_token'}
              });
            } else {
              return errorCallback('error');
            }
          }
        };
      });

      spyOn($twitterApi, 'postStatusUpdate').and.callFake(function(message) {
        return {
          then: function(callback, errorCallback) {
            if (message === 'some tweet') {
              return callback(message);
            } else {
              return errorCallback(401);
            }
            
          }
        };
      });

      spyOn($twitterApi, 'configure');
  }));

  afterEach(inject(function() {
    window.localStorage.clear();
  }));

  describe('storeUserToken', function() {
    it('stores tokens correctly', function() {
      var token = {token: 'some_token'};
      TwitterService.storeUserToken(token);
      expect(JSON.parse(TwitterService.getStoredToken())).toEqual(token);
    });
  });

  describe('isAuthenticated', function() {
    it('is authenticated if you have token', function() {
      var token = {token: 'some_token'};
      TwitterService.storeUserToken(token);
      expect(TwitterService.isAuthenticated()).toEqual(true);
    });
  });

  describe('initialize', function() {
    it('initializes correctly if you have token', function() {
      var token = {token: 'some_token'};
      TwitterService.storeUserToken(token);
      TwitterService.initialize().then(function(res) {
        expect(res.value).toEqual(true);
      });
      TwitterService.configure();
    });
  });

  describe('initialize', function() {
    it('initializes correctly if you dont have a token', function() {
      TwitterService.initialize().then(function(res) {
        expect(res.value).toEqual(true);
      });
    });
  });

  describe('postTweet', function() {
    it('posts tweets', function() {
      TwitterService.postTweet('some tweet', function(res) {
        expect(res).toEqual('some tweet');
      });
    });
  });

  describe('postTweet', function() {
    it('posts tweet error', function() {
      TwitterService.postTweet('some bad tweet', function(res) {});
      expect($cordovaOauth.twitter).toHaveBeenCalled();
      expect($twitterApi.configure).toHaveBeenCalled();
    });
  });

});
