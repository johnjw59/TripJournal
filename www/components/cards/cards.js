angular.module('tripCards', []) 
.directive('tripCard', function() {
  return {
    scope: {

    },
    templateUrl: 'components/cards/cards.tpl.html',
    link: function($scope, $rootScope) {
      // This would usually have been gotten from parse
      $scope.cards = [
        {
          type: 'image',
          img_url: 'http://cdn.history.com/sites/2/2015/04/hith-eiffel-tower-iStock_000016468972Large.jpg',
          date: 'date and time',
          location: 'location from Google Places API'
        },
        {
          type: 'note',
          text: 'A note or a tweet would essentially look like this. Tweet would maybe have a word bubble around and a twitter logo or something.',
          date: 'date and time',
          location: 'location from Google Places API'
        }
      ];

      $scope.$on('pictureTaken', function(event, data) {
        console.log(data);
        // img would usually contain the google drive url and already have time and location
        $scope.cards.unshift(data);
      });

      $scope.$on('noteMade', function(event, data) {
        console.log(data);
        $scope.cards.unshift(data);
        $scope.saveCard(data);
      });

      $scope.saveCard = function(data, type) {
        var Card = Parse.Object.extend("Card");
        var card = new Card();
        card.set("tripId",1); // hard coded for now
        card.set("cardType", data.type);
        // card.set("location", data.location);
        card.set("location", new Parse.GeoPoint({latitude: 40.0, longitude: -30.0}));
        card.set("data", data.text);
        card.save(null,{});
      }
    }
  };
});
