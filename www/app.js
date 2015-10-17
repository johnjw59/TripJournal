angular.module('app', ['ionic', 'page.home'])

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
    .state('app', {
      url: "/app",
      abstract: true,
      templateUrl: "pages/home/menu.tpl.html",
      controller: 'MenuCtrl'
    })
  .state('app.home', {
      url: "/home",
      views: {
        'menuContent' :{
          templateUrl: "pages/home/home.tpl.html",
          controller: 'HomeCtrl'
        }
      }
    })
  $urlRouterProvider.otherwise('/');
});
