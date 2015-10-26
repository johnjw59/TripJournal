angular.module('TwitterService', [])
.factory('TwitterService', function($cordovaOauth, $cordovaOauthUtility, $http, $resource, $q) {
  var twitterKey = "twitter_user_tokens";
  var clientId = 'MrNcTUs3R9avp1eR0P2krSqtF';
  var clientSecret = 'UXofLYtuz1oJVZc6vLkAtFjhY0fbR7pMZvGXgUK7wWtKyzbgF5';

  function storeUserToken(data) {
    window.localStorage.setItem(twitterKey, JSON.stringify(data));
  }

  function getStoredToken() {
    return window.localStorage.getItem(twitterKey);
  }

  function createTwitterSignature(method, url) {
    var token = angular.fromJson(getStoredToken());
    var oauthObject = {
      oauth_consumer_key: clientId,
      oauth_nonce: $cordovaOauthUtility.createNonce(10),
      oauth_signature_method: "HMAC-SHA1",
      oauth_token: token.oauth_token,
      oauth_timestamp: Math.round((new Date()).getTime() / 1000.0),
      oauth_version: "1.0"
    };
    var signatureObj = $cordovaOauthUtility.createSignature(method, url, oauthObject, {}, clientSecret, token.oauth_token_secret);
    console.log(signatureObj);
    $http.defaults.headers.common.Authorization = signatureObj.authorization_header;
  }

  return {
    initialize: function() {
      console.log('init')
      var deferred = $q.defer();
      var token = getStoredToken();

      if (token !== null) {
        deferred.resolve(true);
      } else {
        console.log('1');
        $cordovaOauth.twitter(clientId, clientSecret).then(function(result) {
          console.log(result);
          storeUserToken(result);
          deferred.resolve(true);
        }, function(error) {
          console.log(error);
          deferred.reject(false);
        });
      }
      console.log(deferred.promise);
      return deferred.promise;
    },
    isAuthenticated: function() {
      return getStoredToken() !== null;
    },
    getHomeTimeline: function() {
      var home_tl_url = 'https://api.twitter.com/1.1/statuses/home_timeline.json';
      createTwitterSignature('GET', home_tl_url);
      return $resource(home_tl_url).query();
    },
    postTweet: function() {
      var post_url = 'https://api.twitter.com/1.1/statuses/update.json';
      createTwitterSignature('POST', post_url);
      return $resource(post_url).save();
    },
    storeUserToken: storeUserToken,
    getStoredToken: getStoredToken,
    createTwitterSignature: createTwitterSignature
  };
});