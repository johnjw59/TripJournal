angular.module('tripCards', []) 
.directive('tripCard', function() {
  return {
    scope: {

    },
    templateUrl: 'components/cardview/cardview.tpl.html',
    link: function($scope, $rootScope) {
      // This would usually have been gotten from parse
      $scope.cards = [
        {
          type: 'image',
          img_url: 'http://cdn.history.com/sites/2/2015/04/hith-eiffel-tower-iStock_000016468972Large.jpg',
          date: 'date and time',
          loc_name: 'location from Google Places API'
        },
        {
          type: 'note',
          text: 'A note or a tweet would essentially look like this. Tweet would maybe have a word bubble around and a twitter logo or something.',
          date: 'date and time',
          loc_name: 'location from Google Places API'
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
    }
  };
});
