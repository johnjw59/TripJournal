angular.module('service.cards', [])
.service('CardsService', function($rootScope, $q, $state, $location) {
  var ParseCard = Parse.Object.extend("Card");

  var self = {
    cards: [],

    // Get cards for a specific trip
    update: function() {
      var defer = $q.defer();

      var query = new Parse.Query(ParseCard);
      query.equalTo('tripId', $location.search().id);
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
    }
  };

  return self;
});
