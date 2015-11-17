angular.module('service.cards', [])
.service('CardsService', function($rootScope) {
  var ParseCard = Parse.Object.extend("Card");

  var self = {
    cards: [
      {
        type: 'image',
        data: {img_url: 'img/164.jpg'},
        createdAt: new Date(),
        locationName: 'Hugh Dempster Pavilion',
        location: {
          latitude: 49.2610,
          longitude: -123.2480
        }
      },
      {
        type: 'image',
        data: {img_url: 'img/ConstructionDemoWaste.jpg'},
        createdAt: new Date(),
        locationName: 'UBC',
        location: {
          latitude: 49.2656,
          longitude: -123.2503
        }
      },
      {
        type: 'note',
        data: {text: 'Ugh, construction again. UBC: under construction since 1915...'},
        createdAt: new Date(),
        locationName: 'UBC',
        location: {
          latitude: 49.2656,
          longitude: -123.2503
        }
      },
      {
        type: 'image',
        data: {img_url: 'img/UBC-nest-2.jpg'},
        createdAt: new Date(),
        locationName: 'UBC Nest',
        location: {
          latitude: 49.2673,
          longitude: -123.2504
        }
      },
      {
        type: 'image',
        data: {img_url: 'img/ubc.jpg'},
        createdAt: new Date(),
        locationName: 'UBC',
        location: {
          latitude: 49.2542,
          longitude: -123.2411
        }
      },
      {
        type: 'note',
        data: {text: 'A look around UBC campus, and a demo of TripJournal!!!'},
        createdAt: new Date(),
        locationName: 'UBC',
        location: {
          latitude: 49.2648,
          longitude: -123.2504
        }
      }
    ],

    get: function() {
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
        },
        error: function(err) {
          console.error(err);
        }
      });
    }
  };

  $rootScope.$on('newCard', function(event, obj) {
    self.cards.unshift(card);

    var card = new ParseCard();

    // Both of these values should be retrieved from local storage
    card.set('userId', '1');
    card.set('tripId', '1');

    card.set('cardType', obj.type);
    card.set('locationName', obj.locationName);
    card.set('data', obj.data);

    var loc = new Parse.GeoPoint({latitude: obj.location.latitude, longitude: obj.location.longitude});
    card.set('location', loc);

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
