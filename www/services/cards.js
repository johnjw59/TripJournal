angular.module('service.cards', [])
.service('CardsService', function($rootScope, $q) {
  var ParseCard = Parse.Object.extend("Card");

  var self = {
    cards: [],

    update: function() {
      var defer = $q.defer();

      var query = new Parse.Query(ParseCard);
      // Should be retrieved from local storage
      query.equalTo('userId', '1').equalTo('tripId', 'ZmztBpfCsz');
      query.ascending("createdAt");
      query.find({
        success: function(results) {
          console.log(results);
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
    }
  };

  $rootScope.$on('newCard', function(event, obj) {
    self.cards.unshift(obj);

    var card = new ParseCard();

    // Both of these values should be retrieved from local storage
    card.set('userId', '1');
    card.set('tripId', '1');

    card.set('cardType', obj.type);
    card.set('locationName', obj.locationName);
    card.set('data', obj.data);

    var loc = new Parse.GeoPoint({latitude: obj.location.latitude, longitude: obj.location.longitude});
    card.set('location', loc);

    // Save the new card to Parse (commented out for dev)
    /*card.save(null, {
      success: function(card) {
        console.log(card);
      },
      error: function(card, error) {
        console.error(error);
        console.log(card);
      }
    });*/
    
  });

  return self;
});
