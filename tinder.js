var TINDER_HOST = "https://api.gotinder.com";
var request = require('request');

/**
 * Constructs a new instance of the TinderClient class
 * 
 * @constructor
 * @this {TinderClient}
 */
function TinderClient() {
  var xAuthToken = null;
  
  /**
   * Helper for getting the request object 
   * @param path {String} path the relative URI path
   * @param data {Object} an object of extra values 
   */
  var getRequestOptions = function(path, data) {
    var options = {
      url: TINDER_HOST + "/" + path,
      json: data
    };
  
    if (xAuthToken) {
      var headers = {
        'X-Auth-Token' : xAuthToken
      };
      
      options.headers = headers;
    }
    
    return options;
  };

  /**
   * Issues a GET request to the tinder API
   * @param {String} path the relative path
   * @param {Object} data an object containing extra values 
   * @param {Function} callback the callback to invoke when the request completes 
   */
  var tinderGet = function(path, data, callback) {
    var opts = getRequestOptions(path, data);
    opts.method = 'GET';
    request(opts, callback);
  };

  /**
   * Issues a POST request to the tinder API
   * @param {String} path the relative path
   * @param {Object} data an object containing extra values
   * @param {Function} callback the callback to invoke when the request completes
   */
  var tinderPost = function(path, data, callback) {
    var opts = getRequestOptions(path, data);
    opts.method = 'POST';
    request(opts, callback);
  };

  /**
   * Helper for transforming the request callback values
   * @param {Function} callback the callback 
   */
  var makeTinderCallback = function(callback) {
    return function(error, res, body) {   
      var data = null;
      
      if (!error) {
        if (typeof body === "string")
        {
          try 
          {
            data = JSON.parse(body);
          } catch (err) {
            // todo
          }
        }
        else if (typeof body === "object") {
          data = body;
        }
      }
      
      if (callback) {
        callback(error, data);
      }
    };
  };

  /**
   * Gets a list of profiles nearby
   * @param {Number} limit the maximum number of profiles to fetch
   * @param {Function} callback the callback to invoke when the request completes
   */
  this.getRecommendations = function(limit, callback) {
    tinderGet('user/recs', 
      {
        limit: limit
      },
      makeTinderCallback(callback));
  };
  
  /**
   * Sends a message to a user
   * @param {String} userId the id of the user
   * @param {String} message the message to send
   * @param {Function} callback the callback to invoke when the request completes
   */
  this.sendMessage = function(userId, message, callback) {
    tinderPost('user/matches/' + userId,
      {
        message: message
      },
      makeTinderCallback(callback));
  };
  
  /**
   * Swipes left for a user
   * @param {String} userId the id of the user
   * @param {Function} callback the callback to invoke when the request completes
   */
  this.pass = function(userId, callback) {
    tinderGet('pass/' + userId,
      null,
      makeTinderCallback(callback));
  };
  
  /**
   * Swipes right for a user
   * @param {String} userId the id of the user
   * @param {Function} callback the callback to invoke when the request completes
   */
  this.like = function(userId, callback) {
    tinderGet('like/' + userId,
      null,
      makeTinderCallback(callback));
  };
  
  /**
   * Authorize this tinder client
   * @param {String} fbToken the Facebook token. This will be obtained when authenticating the user
   * @param {Function} callback the callback to invoke when the request completes
   */
  this.authorize = function(fbToken, callback) {
    tinderPost('auth',
      {
        facebook_token: fbToken
      },
      function(error, res, body) {
        if (!error && body.token) {
          xAuthToken = body.token;
          callback();
        } else if (body.error){
          throw "Failed to authenticate: " + body.error
        }
      });
  };
  
  /**
   * Returns whether this client is authorized
   * @return whether or not this client is authorized
   */
  this.isAuthorized = function() {
    return xAuthToken != null;
  }
  
  /**
   * Gets a list of new updates. This will be things like new messages, people who liked you, etc. 
   * @param {Function} callback the callback to invoke when the request completes
   */
  this.getUpdates = function(callback) {
    tinderPost('updates',
      {
        last_activity_date: new Date().toISOString()
      },
      makeTinderCallback(callback));
  };
  
  /**
   * Gets the entire history for the user (all matches, messages, blocks, etc.)
   * 
   * NOTE: Old messages seem to not be returned after a certain threshold. Not yet
   * sure what exactly that timeout is. The official client seems to get this update
   * once when the app is installed then cache the results and only rely on the 
   * incremental updates
   * @param {Function} callback the callback to invoke when the request completes
   */
  this.getHistory = function(callback) {
    tinderPost('updates',
      {
        last_activity_date: ""
      },
      makeTinderCallback(callback));
  };
  
  /**
   * Updates the position for this user 
   * @param {Number} lon the longitude
   * @param {Number} lat the latitutde
   * @param {Function} callback the callback to invoke when the request completes
   */
  this.updatePosition = function(lon, lat, callback) {
    tinderPost('user/ping',
      {
        lon: lon,
        lat: lat
      },
      makeTinderCallback(callback));
  };
}

exports.TinderClient = TinderClient;
