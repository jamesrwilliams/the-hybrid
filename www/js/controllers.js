/*
 * The-Hybrid Companion - Controllers.js
 *
 * Sets the AngularJS states and modules used in the app. 
 * Allocating the controllers and templates forming the 
 * app's structure.
 * 
 * @version		1.0
 * @package		com.wearekiwikiwi.hybrid
 * @description	Page Controllers for The Hybrid Companion App			
 * @author 		James Williams (@James_RWilliams)
 * @copyright 	Copyright (c) 30/05/2015
 *
 */

angular.module('starter.controllers', [])

/**
 *	Settings Page Controller
 *
 *	1.	Fires a confirmation window for the user when they attempt to logout
 *	2.	On confirmation then removes the LocalStorage 	
 *
 */

.controller('SettingsCtrl', function($scope, $ionicPopup, $state){
	
	/* 1 */
	
	$scope.logout = function(){
		
		var prompt = $ionicPopup.show({
					
			title:"Are you sure?",
			scope: $scope,
			buttons: [
				
				{ 
					text: 'Logout', 
					type: 'button-assertive',
					onTap: function(e) {

						/* 2 */
					
						localStorage.removeItem('the-hybrid_player');
						$state.go('app.the-hybrid');
					
					}
      
				},
	
				{ text: 'Cancel' }
				
			]
			
		});	
			
	}
	
})

/**
 *	Lore Page Controller
 *
 */
 
.controller('AJAXCtrl', function($scope, $http) {
	
	$scope.doRefresh = function(){
	
		$http.get('http://www.the-hybrid.co.uk/api.php?request=get_lore_posts').then(function(resp) {
	
			$("#lore_output").text("");
			drawLore(resp.data);
	
		}, function(err) {
			
			console.log('ERR', err);
			// err.status will contain the status code
			
		})
		
		$scope.$broadcast('scroll.refreshComplete');
		
	}
	
	$scope.doRefresh();
	

})

/**
 *	Players Page Controller	
 *
 */

.controller('PlayerCtrl', function($scope, $http, $ionicPopup, $state){
	
	
	
	$scope.playerRefresh = function(){
		
		$scope.getPlayerData();	
		$scope.$broadcast('scroll.refreshComplete');
		
	}
	
	$scope.getPlayerData = function(){
		
		var data = window.localStorage.getItem("the-hybrid_player");
		
		$scope.loginPrompt = function(){
		
			var prompt = $ionicPopup.show({
				
				template: 'Please Login to Access Player Data',
				title:"Choose your side",
				scope: $scope,
				buttons: [
					{ 
						text: 'Login', 
						type: 'button-positive',
						onTap: function(e) {
						
							$state.go('app.login');
							console.log("Login Pressed");
						
						}
          
					},
					{ 
						text: 'Register', 
						type: 'button',
						onTap: function(e){
							
							console.log("Register Pressed");
							window.open('http://www.the-hybrid.co.uk', '_system', 'location=yes'); return false;
							
						}
						
					}
					
				]
				
			});
	  	
	  	};

		
		if(data != null){
			
			data = JSON.parse(data);
			
			console.log(data);
			
			$("#player_id").text("Player ID: " + data.player.player_id);
			$("#player_xp").text("XP: " + data.player.xp.xp_general);
			$("#player_health").text("HP: " + data.player.health);
			
			$("#vampire_kills").text(data.player.xp.xp_vampire);
			$("#werewolf_kills").text(data.player.xp.xp_werewolf);
			$("#ghost_kills").text(data.player.xp.xp_ghost);
			$("#zombie_kills").text(data.player.xp.xp_zombie);
			
			
		}else{
			
			$scope.loginPrompt();
						
		}
		
		
	}
	
	$scope.playerRefresh();
	
})

.controller('LoginCtrl', function($scope, $http, $state){
	
 $scope.data = {}
  
  $scope.showPopup = function($scope, transformRequestAsFormPost) {	 
	  
	$http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
	
	var password = $("#password").val();
	var username = $("#username").val();
	
	var _password = encodeURIComponent(password);
	var _username = encodeURIComponent(username);
	
	$http({
	
		method: 'POST',
		url: 'http://www.the-hybrid.co.uk/api.php',
		data: $.param({request: "get_player_data", username: username, password: _password}),
		headers: {'Content-Type':'application/x-www-form-urlencoded'}
		
	})
	.success(function(dataFromServer, status, headers, config){
		
		console.log(config);
		console.warn(dataFromServer);
		
		var temp_string = JSON.stringify(dataFromServer);
		
		window.localStorage.setItem("the-hybrid_player",temp_string);
		
		$state.go('app.player');
	
	});
   
  };
  
})

/**
 *	Map Page Controller
 *	
 *
 */

.controller('MapCtrl',function($scope, $ionicPopup, $timeout, $http){
	
	

	$scope.claim = function(){ $scope.claimDialog(); };
	
	$scope.claimDialog = function(){
		
		var claim = $ionicPopup.show({
			
			template: '<p>The fate of humanity is in your hand</p><button ng-click="vampire()" ng-value="1" class="button button-block">Vampire</button"><button ng-click="werewolf()" class="button button-block">Werewolf</button><button class="button button-block" ng-click="ghost()">Ghost</button><button ng-click="zombie()" class="button button-block">Zombie</button>',
				
			title:"Choose your side",
			scope: $scope,
			buttons: [
				
				{ text: 'Close', type: 'button-positive'	}
				
			]
			
		});
	  	
	  	$timeout(function() {
		     claim.close();
		  }, 6000);
  	
  	};
	
	/**
	 * Fallback Alert Dialog for no internet connection.
	 */
	
	$scope.showAlert = function() {
	
		var alertPopup = $ionicPopup.alert({
			
			title: 'Infection Requires an Internet Connection',
			template: 'It seems The Hybrid Companion cannot connect to the game servers. Please try again later.',
			animation: 'fade-in'
		
		});
		
		
	};
	
	/**	
	 *	Depending on which option was clicked in the custom Popup UI
	 *	pass a variable to the claimLocation Libaray in lib.js
	 */
	
	$scope.vampire = function($scope){ 	claim_location(1, game); }
	$scope.werewolf = function($scope){ claim_location(2, game); }
	$scope.ghost = function($scope){ 	claim_location(3, game); }
	$scope.zombie = function($scope){ 	claim_location(4, game); }
	
	/* 
	 *	Send the update command to refresh the value for the newly claimed enviroment.
	 *	game_api.php content for the PHP script that handles this request.
	 */	
	
	$scope.sendUpdate = function(){
		
		/**
		 *	Create the HTTP POST Request with Variables
		 */
		
		$http({
		
			method: 'POST',
			url: 'http://www.jamesrwilliams.co.uk/hybrid/api.php',
			data: $.param({request: "update_game", data:update_game}),
			headers: {'Content-Type':'application/x-www-form-urlencoded'}
				
		})
		
		/**
		 *	Success Callback if request was made then refreshes the display
		 */ 
		
		.success(function(dataFromServer, status, headers, config){
			
			$scope.update();
			$scope.claim.close();
		
		});
		
	};
	
	/**
	 *	Set a timeout to update the display 
	 *	after the secified duration of time.
	 */
	
	$timeout(function(){
		
		$scope.update();
		
	}, 6000);
	
	/**
	 *	Function to fetch the latest game setup file from the server
	 */
	
	$scope.update = function(){
		
		$http.get('http://www.jamesrwilliams.co.uk/hybrid/api.php?request=fetch_game').then(function(resp) {
			
			// Response String needs sanitising from PHP to JSON
			game = resp.data.replace(/\\"/g, '"');
			game = game.substring(1, game.length-1);
			
			// Initialise the game - see Lib.js
			initialise(JSON.parse(game));
			
	
		}, function(err) {
			
			$scope.showAlert(); // If any server issues display error window to user.
			
		});
		
	};

	$scope.update();	// Call for an update for the first time the page is opened	
	
});