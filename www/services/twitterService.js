angular.module('TwitterService', [])
.factory('TwitterService', function($cordovaOauth, $cordovaOauthUtility, $http, $resource, $q, $twitterApi) {
  var twitterKey = 'twitter_user_tokens';
  var clientId = 'MrNcTUs3R9avp1eR0P2krSqtF';
  var clientSecret = 'UXofLYtuz1oJVZc6vLkAtFjhY0fbR7pMZvGXgUK7wWtKyzbgF5';

  function storeUserToken(data) {
    window.localStorage.setItem(twitterKey, JSON.stringify(data));
  }

  function getStoredToken() {
    return window.localStorage.getItem(twitterKey);
  }

  return {
    initialize: function() {
      var deferred = $q.defer();
      var token = getStoredToken();

      if (token !== null) {
        deferred.resolve(true);
      } else {
        $cordovaOauth.twitter(clientId, clientSecret).then(function(result) {
          $twitterApi.configure(clientId, clientSecret, result);
          storeUserToken(result);
          deferred.resolve(true);
        }, function(error) {
          console.log(error);
          deferred.reject(false);
        });
      }
      return deferred.promise;
    },
    configure: function() {
      var token = JSON.parse(getStoredToken());
      if (token !== null && token !== '') {
        $twitterApi.configure(clientId, clientSecret, token);
      }
    },
    isAuthenticated: function() {
      return getStoredToken() !== null;
    },
    postTweet: function(message, callback) {
      $twitterApi.postStatusUpdate(message).then(function(result) {
        callback(result);
      }, function(error) {
        if (error === 401) {
          $cordovaOauth.twitter(clientId, clientSecret).then(function(result) {
            $twitterApi.configure(clientId, clientSecret, result);
            storeUserToken(result);
          }, function(error) {
            console.log(error);
          });
        }
      });
    },
    storeUserToken: storeUserToken,
    getStoredToken: getStoredToken,
  };
});
