angular.module('app', ['ionic', 'ngCordova', 'ngTwitter', 'ngResource', 'service.geolocation', 'service.cards', 'page.login', 'page.home', 'page.setting', 'TwitterService'])
.run(function($ionicPlatform, TwitterService, GeolocationService) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
    TwitterService.configure();

    GeolocationService.loc();

    Parse.initialize("MY4KyWo5RUK2yX6GIFEambS54Mv8X4EXm7PIoSBs","qFqeFSzjVHxEpOKYWKjuOHYs42PhkzWWwVSEhaqE");
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
  .state('home', {
    url: '/home',
    templateUrl: 'pages/home/home.tpl.html',
    controller: 'HomeCtrl'
  })
  .state('setting', {
    url: '/setting',
    templateUrl: 'pages/setting/setting.tpl.html',
    controller: 'SettingCtrl'
  });
  /*
    if (no authentication token) {
      $urlRouterProvider.other('/login');
    } else {
      $urlRouterProvider.otherwise('/home');
    }
  */ 
  $urlRouterProvider.otherwise('/home');
  
});
