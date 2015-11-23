angular.module('app', ['ionic', 'ngCordova', 'ngTwitter', 'ngResource', 'service.geolocation', 'service.cards', 'page.login', 'page.home', 'page.setting', 'page.newTrip', 'page.allTrips', 'page.trip', 'TwitterService'])
.run(function($ionicPlatform, TwitterService, GeolocationService, CardsService, $state) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
    
    TwitterService.configure();
    GeolocationService.loc();

    window.handleOpenURL = function(url) {
      setTimeout(function() {
        alert("Logged in to Instagram!");
        $state.go('setting');
      }, 0);
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
  })
  .state('all-trips', {
    url: '/all-trips',
    templateUrl: 'pages/all-trips/all-trips.tpl.html',
    controller: 'AllTripsCtrl'
  })
  .state('trip', {
    url: '/trip?:id',
    templateUrl: 'pages/trip/trip.tpl.html',
    controller: 'TripCtrl'
  });

  if (Parse.User.current()) {
    if (window.localStorage.getItem('trip_id') === null) {
      $urlRouterProvider.otherwise('/new-trip');
    } else {
      $urlRouterProvider.otherwise('/home');
    }
  } else {
    $urlRouterProvider.otherwise('/login');
  }
});
