/*
 * The-Hybrid Companion - App.js
 *
 * Sets the AngularJS states and modules used in the app. 
 * Allocating the controllers and templates forming the 
 * app's structure.
 * 
 * @version		1.0
 * @package		com.wearekiwikiwi.hybrid
 * @description	App Controller for The Hybrid Companion App			
 * @author 		James Williams (@James_RWilliams)
 * @copyright 	Copyright (c) 30/05/2015
 *
 */	
 
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
        templateUrl: "templates/player.html",
        controller: "PlayerCtrl"
      }
    }
  })
  
   .state('app.the-hybrid', {
    url: "/the-hybrid",
    views: {
      'menuContent': {
        templateUrl: "templates/the-hybrid.html"
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
    
    .state('app.settings', {
	    
	    url: "/settings",
	    views: {
		    
			'menuContent': {
				
				templateUrl: "templates/settings.html",
				controller: "SettingsCtrl"

        	}
		    
		}
	    
    });
    
  // If none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/player');
  
});