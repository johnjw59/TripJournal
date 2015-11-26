angular.module('app', ['ionic', 'ngResource', 'service.cards', 'page.home'])
.run(function($ionicPlatform, CardsService, $state) {
  $ionicPlatform.ready(function() {
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

// Force tabs bar to bottom in Android (iOS default is already bottom)
.config(function($ionicConfigProvider) {
  $ionicConfigProvider.tabs.position('bottom');
})

// Route to different page templates
.config(function($stateProvider, $urlRouterProvider) {
  Parse.initialize("MY4KyWo5RUK2yX6GIFEambS54Mv8X4EXm7PIoSBs","qFqeFSzjVHxEpOKYWKjuOHYs42PhkzWWwVSEhaqE");
  
  $stateProvider
  .state('home', {
    url: '/',
    templateUrl: 'pages/home/home.tpl.html',
    controller: 'HomeCtrl',
    resolve: {
      cards: function(CardsService) {
        return CardsService.update();
      }
    }
  });
  $urlRouterProvider.otherwise('/');
});
