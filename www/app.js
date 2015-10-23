angular.module('app', ['ionic', 'ngCordova', 'page.home', 'page.setting'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

// Route to different page templates
.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('home', {
      url: '/',
      templateUrl: 'pages/home/home.tpl.html',
      controller: 'HomeCtrl'
    })

    .state('setting', {
      url: '/setting',
      templateUrl: 'pages/setting/setting.tpl.html',
      controller: 'SettingCtrl'
    })
  $urlRouterProvider.otherwise('/');
});
