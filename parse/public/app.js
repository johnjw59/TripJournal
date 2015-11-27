angular.module('app', ['ionic', 'ngResource', 'service.cards', 'page.home'])
.run(function($ionicPlatform) {
  Parse.initialize("MY4KyWo5RUK2yX6GIFEambS54Mv8X4EXm7PIoSBs","qFqeFSzjVHxEpOKYWKjuOHYs42PhkzWWwVSEhaqE");

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
  $stateProvider
  .state('landing', {
    url: '/',
    templateUrl: 'pages/landing/landing.tpl.html'
  })
  .state('home', {
    url: '/:userId/:tripId',
    templateUrl: 'pages/home/home.tpl.html',
    controller: 'HomeCtrl',
    resolve: {
      cards: function($stateParams, CardsService) {
        return CardsService.update($stateParams.userId, $stateParams.tripId);
      }
    }
  });
  $urlRouterProvider.otherwise('/');
});
