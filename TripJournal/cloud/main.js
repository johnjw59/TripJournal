// Adapted from https://github.com/ParsePlatform/CloudCodeOAuthGitHubTutorial

/**
 * Authenticate With Instagram
 *
 * There will be three routes:
 *  * / - The main route will show a page with a Login with Instagram link
 *       JavaScript will detect if it's logged in and navigate to /main
 * /authorize - This url will start the OAuth process and redirect to Instagram
 * /oauthCallback - Sent back from Instagram, this will validate the authorization
 *                    and update a Parse User before opening app again
 *
 * @author Fosco Marotto (Facebook) <fjm@fb.com>
 * Originally for Github and webapp, adapted for Instagram and Ionic by Gisli Thor
 */

/**
 * Load needed modules.
 */
var express = require('express');
var querystring = require('querystring');
var _ = require('underscore');
var Buffer = require('buffer').Buffer;

/**
 * Create an express application instance
 */
var app = express();

/**
 * Instagram specific details, including application id and secret
 */
var instagramClientId = '3614fce7ef8c43b2bafce9927bdbc178';
var instagramClientSecret = 'b95638dd8db94dbca4abaf5a716c6369';

var insta_redirect_uri = 'https://gisttortrip.parseapp.com/oauthCallback';

var instagramRedirectEndpoint = 'https://api.instagram.com/oauth/authorize/?';
instagramRedirectEndpoint += 'client_id=' + instagramClientId;
instagramRedirectEndpoint += '&redirect_uri=' + insta_redirect_uri;
instagramRedirectEndpoint += '&response_type=code&';

var instagramValidateEndpoint = 'https://api.instagram.com/oauth/access_token';
var instagramUserEndpoint = 'https://api.instagram.com/v1/users/self/';

/**
 * In the Data Browser, set the Class Permissions for these 2 classes to
 *   disallow public access for Get/Find/Create/Update/Delete operations.
 * Only the master key should be able to query or write to these classes.
 */
var TokenRequest = Parse.Object.extend("TokenRequest");
var TokenStorage = Parse.Object.extend("TokenStorage");

/**
 * Create a Parse ACL which prohibits public access.  This will be used
 *   in several places throughout the application, to explicitly protect
 *   Parse User, TokenRequest, and TokenStorage objects.
 */
var restrictedAcl = new Parse.ACL();
restrictedAcl.setPublicReadAccess(false);
restrictedAcl.setPublicWriteAccess(false);

/**
 * Global app configuration section
 */
app.set('views', 'cloud/views');  // Specify the folder to find templates
app.set('view engine', 'ejs');    // Set the template engine
app.use(express.bodyParser());    // Middleware for reading request body

/**
 * Main route.
 *
 * When called, render the login.ejs view
 */
app.get('/', function(req, res) {
  res.render('login', {});
});

/**
 * Authenticating with Instagram route.
 *
 * When called, generate a request token and redirect the browser to Instagram.
 */
app.get('/authorize', function(req, res) {
  // Use sessionId to get user of request.
  var sessionId = req.query.sessionId;

  var tokenRequest = new TokenRequest();
  // Secure the object against public access.
  tokenRequest.setACL(restrictedAcl);
  /**
   * Save this request in a Parse Object for validation when Instagram responds
   * Use the master key because this class is protected
   */
  tokenRequest.save(null, { useMasterKey: true }).then(function(obj) {
    /**
     * Redirect the browser to Instagram for authorization.
     */
    var state = obj.id + 'split' + sessionId;
    res.redirect(
      instagramRedirectEndpoint + querystring.stringify({
        state: state
      })
    );
  }, function(error) {
    // If there's an error storing the request, render the error page.
    res.render('error', { errorMessage: 'Failed to save auth request.'});
  });

});

/**
 * OAuth Callback route.
 *
 * This is intended to be accessed via redirect from Instagram.  The request
 *   will be validated against a previously stored TokenRequest and against
 *   another Instagram endpoint, and if valid, a User will be updated with 
 *   details from Instagram.  We then open the app again where the same user
 *   is still logged in.
 */
app.get('/oauthCallback', function(req, res) {
  var data = req.query;
  var token;
  var sessionId = data.state.split('split')[1];
  /**
   * Validate that code and state have been passed in as query parameters.
   * Render an error page if this is invalid.
   */
  if (!(data && data.code && data.state)) {
    res.render('error', { errorMessage: 'Invalid auth response received.'});
    return;
  }
  var query = new Parse.Query(TokenRequest);
  /**
   * Check if the provided state object exists as a TokenRequest
   * Use the master key as operations on TokenRequest are protected
   */
  Parse.Cloud.useMasterKey();
  Parse.Promise.as().then(function() {
    var objId = data.state.split('split')[0];
    return query.get(objId);
  }).then(function(obj) {
    // Destroy the TokenRequest before continuing.
    return obj.destroy();
  }).then(function() {
    // Validate & Exchange the code parameter for an access token from Instagram
    return getInstagramAccessToken(data.code);
  }).then(function(access) {
    /**
     * Process the response from Instagram
     */
    var instagramData = access.data;
    console.log(instagramData);
    if (instagramData && instagramData.access_token) {
      // Instagram returns user info with access token so we don't need
      // another request.
      token = access.data.access_token;
      return Parse.Promise.as(access);
    } else {
      return Parse.Promise.error("Invalid access request.");
    }
  }).then(function(userDataResponse) {
    /**
     * Process the users Instagram details, return either the connectUserToInstagram
     *   promise, or reject the promise.
     */
    var userData = userDataResponse.data;
    if (userData && userData.user.id) {
      return connectUserToInstagram(token, userData, sessionId);
    } else {
      return Parse.Promise.error("Unable to parse Instagram data");
    }
  }).then(function(user) {
    /**
     * Open app again using https://github.com/EddyVerbruggen/Custom-URL-scheme
     */
    res.redirect('tripjournal://?sessionId=' + sessionId);
  }, function(error) {
    /**
     * If the error is an object error (e.g. from a Parse function) convert it
     *   to a string for display to the user.
     */
    if (error && error.code && error.error) {
      error = error.code + ' ' + error.error;
    }
    res.render('error', { errorMessage: JSON.stringify(error) });
  });

});

/**
 * Attach the express app to Cloud Code to process the inbound request.
 */
app.listen();

/**
 * Cloud function which will load a user's accessToken from TokenStorage and
 * request their details from Instagram for display on the client side.
 */
Parse.Cloud.define('getInstagramData', function(request, response) {
  if (!request.user) {
    return response.error('Must be logged in.');
  }
  var query = new Parse.Query(TokenStorage);
  query.equalTo('user', request.user);
  query.ascending('createdAt');
  Parse.Promise.as().then(function() {
    return query.first({ useMasterKey: true });
  }).then(function(tokenData) {
    console.log('tokenData', tokenData);
    if (!tokenData) {
      return Parse.Promise.error('No Instagram data found.');
    }
    return getInstagramUserDetails(tokenData.get('instagramAccessToken'));
  }).then(function(userDataResponse) {
    var userData = userDataResponse.data;
    console.log(userDataResponse.data);
    response.success(userData);
  }, function(error) {
    response.error(error);
  });
});

Parse.Cloud.define('isInstagramAuth', function(request, response) {
  if (!request.user) {
    return response.error('Must be logged in.');
  }
  var query = new Parse.Query(TokenStorage);
  query.equalTo('user', request.user);
  query.ascending('createdAt');
  Parse.Promise.as().then(function() {
    return query.first({ useMasterKey: true });
  }).then(function(tokenData) {
    console.log(tokenData);
    return response.success(!!tokenData);
  }, function(error) {
    response.error(error);
  });
});

Parse.Cloud.define('getInstagramPhotos', function(request, response) {
  if (!request.user) {
    return response.error('Must be logged in.');
  }
  return getInstagramAccessTokenFromParse(request.user)
  .then(function(token) {
    return Parse.Cloud.httpRequest({
      method: 'GET',
      url: 'https://api.instagram.com/v1/users/self/media/recent/',
      params: {
        access_token : token
      },
      headers: {
        'User-Agent': 'Parse.com Cloud Code'
      }
    }).then(function(httpResponse) {
      response.success(httpResponse.data);
    }, function(httpResponse) {
      console.error(httpResponse);
      response.error('Request failed with response code ' + httpResponse.status);
    });
  })
});

var getInstagramAccessTokenFromParse = function(user) {
  var query = new Parse.Query(TokenStorage);
  query.equalTo('user', user);
  query.ascending('createdAt');
  return query.first({ useMasterKey: true })
  .then(function(tokenData) {
    if (!tokenData) {
      return Parse.Promise.error('No Instagram data found.');
    }
    console.log(tokenData.get('instagramAccessToken'));
    return Parse.Promise.as(tokenData.get('instagramAccessToken'));
  }, function(error) {
    return Parse.Promise.error(error);
  });
};

/**
 * This function is called when Instagram redirects the user back after
 *   authorization.  It calls back to Instagram to validate and exchange the code
 *   for an access token.
 */
var getInstagramAccessToken = function(code) {
  var body = querystring.stringify({
    client_id: instagramClientId,
    client_secret: instagramClientSecret,
    code: code,
    // instagram specific stuff
    grant_type: 'authorization_code',
    redirect_uri: insta_redirect_uri
  });
  return Parse.Cloud.httpRequest({
    method: 'POST',
    url: instagramValidateEndpoint,
    headers: {
      'Accept': 'application/json',
      'User-Agent': 'Parse.com Cloud Code'
    },
    body: body
  });
}

/**
 * This function calls the instagramUserEndpoint to get the user details for the
 * provided access token, returning the promise from the httpRequest.
 */
var getInstagramUserDetails = function(accessToken) {
  return Parse.Cloud.httpRequest({
    method: 'GET',
    url: instagramUserEndpoint,
    params: { access_token: accessToken },
    headers: {
      'User-Agent': 'Parse.com Cloud Code'
    }
  });
}

var connectUserToInstagram = function(accessToken, instagramData, sessionId) {
  var query = new Parse.Query(Parse.Session);
  query.equalTo('objectId', sessionId);
  query.ascending('createdAt');
  // Find the client session in Parse
  return query.first({ useMasterKey: true }).then(function(sessionData) {
    // Find the user of the session (the user we are authenticating)
    var user = sessionData.get('user');
    return user.fetch({ useMasterKey: true }).then(function(user) {
      // Find a token
      var tokenQuery = new Parse.Query(TokenStorage);
      tokenQuery.equalTo('instagramId', instagramData.user.id);
      tokenQuery.ascending('createdAt');
      return tokenQuery.first({ useMasterKey: true }).then(function(tokenData) {
        // New instagram id
        if (!tokenData) {
          return connectNewInstagramUser(accessToken, instagramData, user);
        }
        // Strange case if instagramId is already assigned to other user
        if (tokenData.get('user').username !== user.username) {
          return connectNewInstagramUser(accessToken, instagramData, user);
        }
        // Update the accessToken if it is different.
        if (accessToken !== tokenData.get('instagramAccessToken')) {
          tokenData.set('instagramAccessToken', accessToken);
        }
        return tokenData.save(null, { useMasterKey: true });
      });
    }).then(function(obj) {
     // Return the user object.
      return Parse.Promise.as(user);
    });
  });
};

var connectNewInstagramUser = function(accessToken, instagramData, user) {
  var ts = new TokenStorage();
  ts.set('instagramId', instagramData.user.id);
  ts.set('instagramAccessToken', accessToken);
  ts.set('user', user);
  ts.setACL(restrictedAcl);
  // Use the master key because TokenStorage objects should be protected.
  return ts.save(null, { useMasterKey: true });
};