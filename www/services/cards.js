angular.module('service.cards', [])
.service('CardsService', function($rootScope, $q, $state) {
  var ParseCard = Parse.Object.extend("Card");

  var currentUser = Parse.User.current();
  var userId;

  if (currentUser !== null) {
    userId = Parse.User.current().getUsername();
  }

  var self = {
    cards: [],

    refreshId: function() {
      userId = Parse.User.current().getUsername();
    },

    // Update cards array with current trip cards
    update: function() {
      var defer = $q.defer();

      var query = new Parse.Query(ParseCard);
      query.equalTo('userId', userId).equalTo('tripId', window.localStorage.getItem('trip_id'));
      query.ascending("createdAt");
      query.find({
        success: function(results) {
          self.cards = [];
          for(i = 0; i < results.length; i++) {
            self.cards.push(results[i].attributes);
            self.cards[i].createdAt = results[i].createdAt;
          }
          defer.resolve();
        },
        error: function(err) {
          console.error(err);
          defer.reject(err);
        }
      });
      return defer.promise;
    },

    // Get cards for a specific trip
    getTrip: function(trip_id) {
      var defer = $q.defer();

      var query = new Parse.Query(ParseCard);
      query.equalTo('userId', userId).equalTo('tripId', trip_id);
      query.ascending("createdAt");
      query.find({
        success: function(results) {
          var ret = [];
          for(i = 0; i < results.length; i++) {
            ret.push(results[i].attributes);
            ret[i].createdAt = results[i].createdAt;
          }
          defer.resolve(ret);
        },
        error: function(err) {
          console.error(err);
          defer.reject(err);
        }
      });
      return defer.promise;
    }
  };

  // Save new cards to Parse when they are created
  $rootScope.$on('newCard', function(event, obj) {
    self.cards.unshift(obj);

    var card = new ParseCard();

    card.set('userId', userId);
    card.set('tripId', window.localStorage.getItem('trip_id'));

    var type = obj.type;
    card.set('type', type);
    card.set('locationName', obj.locationName);
    
    // save picture to Parse cloud
    if (type == 'image') {
      var imageData = obj.data;
      var imageFile = new Parse.File("image", { base64: imageData.img_url });
      
      imageFile.save().then(function() {
        imageData.img_url = imageFile.url();      
        card.set('data', imageData);

        console.log('image url: ' + imageData.img_url);
      }, function(error) {
        console.error(error);
      });      
    } else {;
      card.set('data', obj.data);
    }

    var loc = new Parse.GeoPoint({latitude: obj.location.latitude, longitude: obj.location.longitude});
    card.set('location', loc);

    // Save the new card to Parse (commented out for dev)
    card.save(null, {
      success: function(card) {
        console.log(card);
      },
      error: function(card, error) {
        console.error(error);
        console.log(card);
      }
    });
  });

  return self;
});
