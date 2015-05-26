// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    
 
    
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
     
      
    }
  });
  
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

  .state('app', {
    url: "/app",
    abstract: true,
    templateUrl: "templates/menu.html",
    controller: 'AppCtrl'
  })

  .state('app.search', {
    url: "/search",
    views: {
      'menuContent': {
        templateUrl: "templates/search.html"
      }
    }
  })

  .state('app.player', {
    url: "/player",
    views: {
      'menuContent': {
        templateUrl: "templates/player.html"
      }
    }
  })
  
   .state('app.guide', {
    url: "/guide",
    views: {
      'menuContent': {
        templateUrl: "templates/guide.html"
      }
    }
  })
  
   .state('app.news', {
    url: "/news",
    views: {
      'menuContent': {
        templateUrl: "templates/news.html"
      }
    }
  })
  
  .state('app.about', {
    url: "/about",
    views: {
      'menuContent': {
        templateUrl: "templates/about.html"
      }
    }
  })
  
  .state('app.map', {
      url: "/map",
      views: {
        'menuContent': {
          templateUrl: "templates/map.html",
          controller: "MapCtrl"
        }
      }
    })
    
    .state('app.lore', {
      url: "/lore",
      views: {
        'menuContent': {
          templateUrl: "templates/lore.html",
          controller: "AJAXCtrl"

        }
      }
    })
    
    .state('app.login', {
      url: "/login",
      views: {
        'menuContent': {
          templateUrl: "templates/login.html",
          controller: "LoginCtrl"

        }
      }
    })
    
    .state('app.playlists', {
      url: "/playlists",
      views: {
        'menuContent': {
          templateUrl: "templates/playlists.html",
          controller: 'PlaylistsCtrl'
        }
      }
    })

	;
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/player');
  
});