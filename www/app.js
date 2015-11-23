angular.module('app', ['ionic', 'ngCordova', 'ngTwitter', 'ngResource', 'service.geolocation', 'service.cards', 'page.login', 'page.signup', 'page.home', 'page.setting', 'TwitterService'])
.run(function($ionicPlatform, TwitterService, GeolocationService, CardsService, $state) {
  Parse.initialize("6Na3fektAh8RZyQ7r6rWLNDbJDDkdw05BckYe0DP", "Dfj8w17k4rGru8Ui4n67DnG3yxF4tgbYrLIkZpNl");
  
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
  $stateProvider
  .state('login', {
    url: '/login',
    templateUrl: 'pages/login/login.tpl.html',
    controller: 'LoginCtrl'
  })
  .state('signup', {
    url: '/signup',
    templateUrl: 'pages/signup/signup.tpl.html',
    controller: 'SignupCtrl'
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
    } else {
      $urlRouterProvider.otherwise('/home');
    }
  */ 
  $urlRouterProvider.otherwise('/login');
  
});
