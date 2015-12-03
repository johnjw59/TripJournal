angular.module('service.cards', ['ionic'])
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
      query.descending("createdAt");
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
      query.descending("createdAt");
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
    var type = obj.type;
    // save a copy of the data
    var data = obj.data;
    if (type == 'image') {
      obj.data.img_url = 'data:image/jpeg;base64,' + data.img_url;
    }
    self.cards.unshift(obj);

    var card = new ParseCard();
    card.set('userId', userId);
    card.set('tripId', window.localStorage.getItem('trip_id'));
    card.set('type', type);
    
    // set location details
    var loc = new Parse.GeoPoint({latitude: obj.location.latitude, longitude: obj.location.longitude});
    card.set('location', loc);
    card.set('locationName', obj.locationName);

    // if card is a picture, upload the image to Parse cloud and then save the card
    if (type == 'image') {
      uploadImageAndSave(card, data, 1);
    } else {
      card.set('data', data);
      saveCard(card);
    }
  });

  return self;
});

function uploadImageAndSave(card, imageData, count) {
  var imageFile = new Parse.File("image", { base64: imageData.img_url });
  imageFile.save().then(function() {
    imageData.img_url = imageFile.url();
    card.set('data', imageData);
    saveCard(card);
  }, function(error) {
    console.error('error uploading picture, retry ' + count);
    if (count < 4) {
      uploadImageAndSave(card, imageData, count++);
    }
  });
}

function saveCard(card) {
  card.save(null, {
    success: function(card) {
      console.log('saved card: ' + card);
    },
    error: function(card, error) {
      console.error(error);
      console.log(card);
    }
  });
}
