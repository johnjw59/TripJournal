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

    // Get cards for a specific trip
    getTrip: function() {
      var defer = $q.defer();

      var query = new Parse.Query(ParseCard);
      query.equalTo('userId', 'tripjournalapp@gmail.com').equalTo('tripId', 'ZmztBpfCsz');
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
