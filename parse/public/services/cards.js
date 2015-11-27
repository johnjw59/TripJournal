angular.module('service.cards', [])
.service('CardsService', function($rootScope, $q, $state) {
  var ParseCard = Parse.Object.extend("Card");

  var self = {
    cards: [],

    // Get cards for a specific trip
    update: function(userId, tripId) {
      var defer = $q.defer();
      var query = new Parse.Query(ParseCard);
      query.equalTo('userId', userId).equalTo('tripId', tripId);
      query.ascending("createdAt");
      query.find({
        success: function(results) {
          // if there's no cards for this trip/user go to landing page
          if (results.length === 0) {
            $state.go('landing');
            return;
          }
          
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
