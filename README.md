# tinderjs

  Programmatic access to the Tinder API
  
  
## Installation

    $ npm install tinderjs
    
    
## Introduction

  tinderjs is a simple node.js wrapper around the Tinder API. Below is a simple example which gets a list of nearby profiles and prints them out:
  
    var tinder = require('tinderjs');
    var client = new tinder.TinderClient();
    
    client.authorize(
      <fb user token>,
      <fb user id>,
      function() {
        client.getRecommendations(10, function(error, data){
          console.log(data.results);
        });
      });
    });


## Supported APIs

### .authorize(fb token, fb id, callback)

  Authorizes the `TinderClient`. You must call this before any other method.
  
* `fb token` is a facebook user access token. You would acquire this by having your user log in using your application 
* `fb id` is the id of the facebook user 
* `callback` is called when the request completes 

### .userId

  Once authorized, this property will be set the current profile's tinder user id. 

### .sendMessage(user id, message, callback)

  Sends a message to a user. 
  
* `user id` is the user's id. This is obtained e.g via `getRecommendations` 
* `message` is the message to send. 
* `callback` is called when the request completes 

### .like(user id, callback)
  
  Likes a user (swipes right).
  
* `user id` is the user's id. This is obtained e.g  via `getRecommendations`
* `callback` is called when the request completes 

### .pass(user id, callback)

  Pass on a user (swipes left).
  
* `user id` is the user's id. This is obtained e.g  via `getRecommendations`
* `callback` is called when the request completes 

### .getRecommendations(limit, callback)

  Gets nearby users
  
* `limit` is how many results to limit the search to 
* `callback` is called when the request completes 

### .getUpdates(callback)

  Checks for updates. The response will show you new messages, new matches, new blocks, etc. 
  
* `callback` is called when the request completes 

### .getHistory(callback)

  Gets the complete history for the user (all matches, messages, blocks, etc.).
  
  NOTE: Old messages seem to not be returned after a certain threshold. Not yet sure what exactly that timeout is. The official client seems to get this update once when the app is installed then cache the results and only rely on the incremental updates

* `callback` is called when the request completes 

### .updatePosition(longitude, latitude, callback)

  Updates your profile's geographic position

* `longitude` is the longitude of the new position
* `latitude` is the latitude of the new position
* `callback` is called when the request completes 


## Examples

  The following example authorizes a client, gets some nearby profiles, likes all of them, and sends a message to any of the ones that match
  
    var tinder = require('tinderjs');
    var client = new tinder.TinderClient();
    var _ = require('underscore')
    
    client.authorize(
      <fb user token>,
      <fb user id>,
      function() {
        client.getRecommendations(10, function(error, data){
          _.chain(data.results)
            .pluck('_id')
            .each(function(id) {
              client.like(id, function(error, data) {
                if (data.matched) {
                  client.sendMessage(id, "hey ;)");
                }
              });
            });
        });
      });
    });
    
## License

  MIT