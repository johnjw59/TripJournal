angular.module('app', ['ionic', 'ngCordova', 'ngTwitter', 'ngResource', 'service.geolocation', 'service.cards', 'page.login', 'page.home', 'page.setting', 'page.newTrip', 'TwitterService'])
.run(function($ionicPlatform, TwitterService, GeolocationService, CardsService) {
  Parse.initialize("MY4KyWo5RUK2yX6GIFEambS54Mv8X4EXm7PIoSBs","qFqeFSzjVHxEpOKYWKjuOHYs42PhkzWWwVSEhaqE");
  
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
    
    TwitterService.configure();
    GeolocationService.loc();
  });
})

// Force tabs bar to bottom in Android (iOS default is already bottom)
.config(function($ionicConfigProvider) {
  $ionicConfigProvider.tabs.position('bottom');
})

// Route to different page templates
.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
  .state('login', {
    url: '/login',
    templateUrl: 'pages/login/login.tpl.html',
    controller: 'LoginCtrl'
  })
  .state('new-trip', {
    url: '/new-trip',
    templateUrl: 'pages/new-trip/new-trip.tpl.html',
    controller: 'NewTripCtrl'
  })
  .state('home', {
    url: '/home',
    templateUrl: 'pages/home/home.tpl.html',
    controller: 'HomeCtrl',
    resolve: {
      cards: function(CardsService) {
        return CardsService.update();
      }
    }
  })
  .state('setting', {
    url: '/setting',
    templateUrl: 'pages/setting/setting.tpl.html',
    controller: 'SettingCtrl'
  });
  /*
    if (no authentication token) {
      $urlRouterProvider.other('/login');
    } else if () {
      $urlRouterProvider.otherwise('/home');
    }
  */
  // if not currently on a trip
  /*if (window.localStorage.getItem('trip_id') === null) {
    $urlRouterProvider.otherwise('/new-trip');
  } else {*/
    $urlRouterProvider.otherwise('/home');
  //}
  
});
