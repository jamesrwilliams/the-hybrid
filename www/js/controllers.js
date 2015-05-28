angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {
  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})

.controller('AJAXCtrl', function($scope, $http) {
	
	$scope.doRefresh = function(){
	
		$http.get('http://www.the-hybrid.co.uk/api.php?request=get_lore_posts').then(function(resp) {
	
			console.log('Success', resp);
			// For JSON responses, resp.data contains the result
	
			drawLore(resp.data);
	
		}, function(err) {
			
			console.log('ERR', err);
			// err.status will contain the status code
			
		})
	
		$scope.$broadcast('scroll.refreshComplete');
		
	}
	

})

.controller('HybridCtrl', function($scope, $ionicPopover, $ionicBackdrop, $timeout){
	
		
	
})

.controller('PlayerCtrl', function($scope, $http){
	
	$scope.playerRefresh = function(){
		
		// console.log("refreshed");
		$scope.$broadcast('scroll.refreshComplete');
		
		$scope.getPlayerData();	
		
	}
	
	$scope.getPlayerData = function(){
		
		$http({
		
			method: 'GET',
			url: './js/player.json'
		
		})
		.success(function(data, status, headers, config){
		
			console.log(data);
			
			/*
			== Assign Data Values to Screen
			*/
			
			$("#player_id").text("Player ID: " + data.player.player_id);
			$("#player_health").text(data.player.health); 
			$("#player_xp").text(data.player.xp.xp_general);
			
			/*
			== Assign XP Values
			*/
			
			$("#vampire_kills").text(data.player.xp.xp_vampire);
			$("#werewolf_kills").text(data.player.xp.xp_werewolf);
			$("#ghost_kills").text(data.player.xp.xp_ghosts);
			$("#zombie_kills").text(data.player.xp.xp_zombie);
	
		});
		
	}
	
	$scope.getPlayerData();
	
})

.controller('LoginCtrl', function($scope, $http){
	
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
	
	});
   
  };
  
})

.controller('MapCtrl',function($scope, $ionicPopup, $timeout, $http){
	
	var game;
	
	$scope.claim = function(){
		
		$scope.claimDialog();
		
	};
	
	$scope.claimDialog = function(){
		
		var claim = $ionicPopup.show({
			
			template: '<p>The fate of humanity is in your hand</p><button ng-click="vampire()" ng-value="1" class="button button-block">Vampire</button"><button ng-click="werewolf()" class="button button-block">Werewolf</button><button class="button button-block" ng-click="ghost()">Ghost</button><button ng-click="zombie()" class="button button-block">Zombie</button>',
				
			title:"Choose your side",
			scope: $scope,
			buttons: [
				
				{ text: 'Cancel', type: 'button-positive'	}
				
			]
			
		});

		claim.then(function(res) {
			
	    	console.log('Tapped!');
	    	
	  	});
	  	
	  	$timeout(function() {
		     claim.close();
		  }, 5000);
  	
  	};
	
	$scope.showAlert = function() {
	
		var alertPopup = $ionicPopup.alert({
			
			title: 'Infection Requires an Internet Connection',
			template: 'It seems The Hybrid Companion cannot connect to the game servers. Please try again later.',
			animation: 'fade-in'
		
		});
		
		
	};
	
	$scope.vampire = function($scope){ claim_location(1, game); }
	$scope.werewolf = function($scope){ claim_location(2, game); }
	$scope.ghost = function($scope){ claim_location(3, game); }
	$scope.zombie = function($scope){ claim_location(4, game); }
	
	$scope.sendUpdate = function(){
		
			claim.close();
		
			$http({
			
				method: 'POST',
				url: 'http://www.jamesrwilliams.co.uk/hybrid/api.php',
				data: $.param({request: "update_game", data:update_game}),
				headers: {'Content-Type':'application/x-www-form-urlencoded'}
					
			})
			.success(function(dataFromServer, status, headers, config){
				
				//console.log(config.data); 
				//console.log("James' " + dataFromServer);
			
			});
			
	};
	
	$http.get('http://www.jamesrwilliams.co.uk/hybrid/api.php?request=fetch_game').then(function(resp) {
	
			
			game = resp.data;
			
			game = game.replace(/\\"/g, '"');
			game = game.substring(1, game.length-1);
			
			game = JSON.parse(game);
			
			initialise(game);
			
	
		}, function(err) {
			
			$scope.showAlert();
			
		})
	
	
});