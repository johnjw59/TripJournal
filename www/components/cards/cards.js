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
          
          img_url: 'https://upload.wikimedia.org/wikipedia/commons/3/3d/Eiffel_Tower_by_the_Seine_river%2C_Paris%2C_2_March_2014.jpg',
          date: 'date and time',
          location: 'location from Google Places API'
        },
        {
          type: 'note',
          text: 'A note or a tweet would essentially look like this. Tweet would maybe have a word bubble around and a twitter logo or something.',
          date: 'date and time',
          location: 'location from Google Places API'
        },
        {
          type: 'tweet',
          user: 'TripJournal',
          profile_img: 'https://abs.twimg.com/sticky/default_profile_images/default_profile_1_normal.png',
          text: 'A tweet.',
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
      });

      $scope.$on('tweetPosted', function(event, data) {
        console.log(data);
        $scope.cards.unshift(data);
      });
    }
  };
});
