angular.module('service.cards', [])
.service('CardsService', function($rootScope) {
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
    console.log(data);
    self.cards.unshift(data);
  });

  return self;
});
