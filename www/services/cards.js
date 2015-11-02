angular.module('service.cards', [])
.service('CardsService', function($rootScope) {
  var self = {
    cards: [
      {
        type: 'image',
        img_url: 'img/eiffel1.jpg',
        date: new Date(),
        loc_name: 'Here',
        loc_coords: {
          lat: 49.2624,
          lon: -123.2432
        }
      },
      {
        type: 'note',
        text: 'A note or a tweet would essentially look like this. Tweet would maybe have a word  bubble around and a twitter logo or something.',
        date: new Date(),
        loc_name: 'There',
        loc_coords: {
          lat: 49.2613,
          lon: -123.2432
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
