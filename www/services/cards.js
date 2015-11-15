angular.module('service.cards', [])
.service('CardsService', function($rootScope) {
  var ParseCard = Parse.Object.extend("Card");

  var self = {
    cards: [
      {
        type: 'image',
        img_url: 'img/164.jpg',
        date: new Date(),
        loc_name: 'Hugh Dempster Pavilion',
        loc_coords: {
          lat: 49.2610,
          lon: -123.2480
        }
      },
      {
        type: 'image',
        img_url: 'img/ConstructionDemoWaste.jpg',
        date: new Date(),
        loc_name: 'UBC',
        loc_coords: {
          lat: 49.2656,
          lon: -123.2503
        }
      },
      {
        type: 'note',
        text: 'Ugh, construction again. UBC: under construction since 1915...',
        date: new Date(),
        loc_name: 'UBC',
        loc_coords: {
          lat: 49.2656,
          lon: -123.2503
        }
      },
      {
        type: 'image',
        img_url: 'img/UBC-nest-2.jpg',
        date: new Date(),
        loc_name: 'UBC Nest',
        loc_coords: {
          lat: 49.2673,
          lon: -123.2504
        }
      },
      {
        type: 'image',
        img_url: 'img/ubc.jpg',
        date: new Date(),
        loc_name: 'UBC',
        loc_coords: {
          lat: 49.2542,
          lon: -123.2411
        }
      },
      {
        type: 'note',
        text: 'A look around UBC campus, and a demo of TripJournal!!!',
        date: new Date(),
        loc_name: 'UBC',
        loc_coords: {
          lat: 49.2648,
          lon: -123.2504
        }
      }
    ],
  };

  $rootScope.$on('newCard', function(event, data) {
    self.cards.unshift(data);

    var card = new ParseCard();

    // Both of these values should be retrieved from local storage
    card.set('userId', 1);
    card.set('tripId', 1);

    card.set('cardType', data.type);
    card.set('locationName', data.loc_name);

    var loc = new Parse.GeoPoint({latitude: data.loc_coords.lat, longitude: data.loc_coords.lon});
    card.set('location', loc);

    switch(data.type) {
      case 'image':
        card.set('data', data.img_url);
        break;
      case 'tweet':
        card.set('data', data.text);
        card.set('twitterUser', data.user);
        card.set('twitterProfilePic', data.pofile_image);
        break;
      case 'note':
        card.set('data', data.text);
        break;
    }

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
