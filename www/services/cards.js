angular.module('service.cards', [])
.service('CardsService', function($rootScope) {
  var self = {
    cards: [
      {
        type: 'image',
        img_url: 'http://cnet4.cbsistatic.com/hub/i/2015/02/25/49752f72-14d6-4033-af9c-88d40611d3c7/5ddb05cc300e5515c348d0d60f4e9e42/eiffel1.jpg',
        date: 'date and time',
        loc_name: 'location from Google Places API'
      },
      {
        type: 'note',
        text: 'A note or a tweet would essentially look like this. Tweet would maybe have a word  bubble around and a twitter logo or something.',
        date: 'date and time',
        loc_name: 'location from Google Places API'
      }
    ],
  };

  $rootScope.$on('newCard', function(event, data) {
    console.log(data);
    self.cards.unshift(data);
  });

  return self;
});
