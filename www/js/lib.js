/*	The-Hybrid Companion - Lib.js
 *
 * 	Sets the AngularJS states and modules used in the app. 
 * 	Allocating the controllers and templates forming the 
 * 	app's structure.
 * 
 *	@version		1.0
 * 	@package		com.wearekiwikiwi.hybrid
 * 	@description	Functions Library for The Hybrid Companion App			
 * 	@author 		James Williams (@James_RWilliams)
 * 	@copyright 		Copyright (c) 30/05/2015
 *
 * 	PS. 
 *
 *	There are a few "jshint ignore:line" lines in this file
 *	they are used to suppress warnings from JSHint. This is done
 *	as the functions here are called by the controllers and are
 *	not refernced by this file very often.
 *
 */

/* Global Variables (...yuck) */

var alert, console, map, i, GMaps;
var game = {};
var position = {};
var polygons = [];
 
/**
 *	drawLore()
 *	
 *	Renders the Lore Data from the server and inserts 
 *	it into the DOM.
 *
 *	@param data 	- Lore Data Object
 * 
 */ 
 
function drawLore(data){ // jshint ignore:line
		
	$.each(data, function(i, value){
		
		$("#lore_output").append("<div class='item item-wrap'><h2>" + value.title + "</h2><p>" + value.text + "</p></div>");
		
	});
	 
}                                                                                                   

/**
 *	drawHex
 *
 *	This function draws a hexagon from the given corrdinates and the size
 *
 *	@param width 	- Width specification of the hexagon.
 *	@param lat		- Latitude origin point for hexagon.
 *	@param lag		- Longitude origin point for the hexagon.
 * 
 */		

function drawHex(width, lat, lng){
	
	var x = 0.0001;
	
	var output = [  
	
		[ lat + (x*1), lng + 0				], 		//1
		[ lat + (x*3), lng + 0				],		//2
		[ lat + (x*4), lng + ((x*1)*2.7)	],		//3
		[ lat + (x*3), lng + ((x*2)*2.7) 	],		//4
		[ lat + (x*1), lng + ((x*2)*2.7) 	],		//5
		[ lat + (x*0), lng + ((x*1)*2.7)	]		//6	
	];
	
	return output;
	
}

/**
 *	isNumber()	
 *
 *	Utility Method for checking if the given values is a number
 *	
 *	@param 	string	- String to check if it is a number
 *	@return bool 	- If the paramerter string a number
 *
 */		

function isNumber(n){
	
   return n == parseFloat(n);
   
}

/**
 *	isEven()
 *
 *	Utility Method for checking if the given values is a number
 * 
 *	@param n		- The variable to check
 *	@return bool 	- If the paramerter number is even 
 *	
 */		

function isEven(n){
	
   return isNumber(n) && (n % 2 === 0);
   
}

/**
 *	isOdd()
 *
 *	Utility Method for checking if the given values is a number
 *
 *	@param	n		- The variable to check
 *	@return bool 	- If the paramerter number is odd 
 * 
 */		

function isOdd(n){
	
   return isNumber(n) && (Math.abs(n) % 2 === 1);
   
}

/**
 *	locationError()	
 *
 *	Utility Method for checking if the given values is a number
 * 
 */		

function locationError(){
	
	alert("ERROR: Could Not Get Location Data");
	
}

/**
 *	drawFences()
 * 
 *	DrawFences maps out the polgons for the Geolocation Game: Infection
 *	
 *	@param Origin_lat	- The starting Latitude of the game grid
 *	@param Orgin_lang 	- The starting Longitude of the game grid
 *	@param game	   		- The game data object
 *
 *
 *	=====================
 *	= Function Overview =
 *	=====================
 *
 *	1. 	Setup Loop for the number of rows in the grid.
 *
 *	2. 	Check if the row number is odd or even. 
 *		Odd rows need to be intended and one less 
 *		than the row count to fit into the grid.
 *
 *	3.	Then Loop for the legnth of each row.
 *
 *	4.	From the count number the offset for the grid
 *		can be calculated.
 *
 *	5.	Then create the map polygon using the 
 *		drawHex() function with settings from
 *		the 'game' object parameter 
 *
 */

function drawFences(origin_lat, origin_lng, game){
	
	
	var offset = 0.000300;
	var oddTab = 0.000270;
	
	var lat_offset, lng_offset, count;
	
	/*	
	 *	Generate the Grid System 
	 */
	 
	/* 1 */
	 
	for(count = 0; count < game.setup.height; count++){
		
		/* 2 */
		
		if(isEven(count)){
			
			/* 3 */
			
			for(i = 0; i < game.setup.width; i++){

				/* 4 */

				lat_offset = (i * 0);
				lng_offset = (i * -0.00054);
			
				/* 5 */
		
				polygons.push(map.drawPolygon({ 
					
					paths: drawHex(1, origin_lat - (offset*count), 
					(origin_lng - lng_offset)), 
					strokeColor: game.grid.strokeColour, 
					strokeOpacity: game.grid.strokeWeight, 
					strokeWeight: game.grid.strokeOpacity, 
					fillColor: game.style.fillColor, 
					fillOpacity: game.style.fillOpactiy
				
				}));			
			
			}
			
		}
		
		/* 2 */
		
		else if(isOdd(count)){
			
			/* 3 */
			
			for(i = 0; i < game.setup.width-1; i++){
				
				/* 4 */

				lat_offset = (i * 0);
				lng_offset = (i * -0.00054);
				
				/* 5 */
		
				polygons.push(map.drawPolygon({ 
					
					paths: drawHex(1, origin_lat - (offset*count), 
					((origin_lng+oddTab) - lng_offset)), 
					strokeColor: game.grid.strokeColour, 
					strokeOpacity: game.grid.strokeWeight, 
					strokeWeight: game.grid.strokeOpacity, 
					fillColor: game.style.fillColor, 
					fillOpacity: game.style.fillOpactiy					
					
				}));	
					
			
			}
		
		}
		
	}
	
}

/**
 *	LocationSucess()
 *
 *	Call back function from init_geo() that confirms
 *	the player location has been found. Then adds a
 * 	google maps marker onto the users position.
 *	
 *	Once the location has been found the claim
 *	button in the interface becomes active,
 *	allowing players to claim territory.
 * 
 */		

var locationSuccess = function(_position) {
		
	position = _position;	
		
	var player = map.addMarker({
	
		lat: position.coords.latitude,
		lng: position.coords.longitude,
		title: 'You'
	});
	
	$("#claimBtn").removeAttr('disabled');
 
};

/**
 *	Init_Geo()
 *
 *	This starts the geolcation game by fetching the 
 *	location and then clears the markers. The callbacks
 * 	within the getCurrentPosition are used to then 
 *	procced based upon their values	
 * 
 */
	
function init_geo(){
	
	navigator.geolocation.getCurrentPosition(locationSuccess, locationError);
	
	map.removeMarkers();
	
}

/**
 *	Claim_location()
 *
 *	@param choice 	- The id value from the UI Modal Button
 *	@param game 	- The game data object.
 *
 *	=====================
 *	= Function Overview =
 *	=====================
 *
 *	This handles most of the logic for the claiming element of
 *	the game.
 *
 *	1. 	Cycles Through the List of Polygons
 *
 *	2. 	Checks if the Player is within a polygon
 *
 *	3.	Checks the user's claim faction and sets the 
 *		corrasponding data value to that species.
 *
 *	4.	Turns JS Object into JSON
 *
 *	5.	Sends JSON to server.
 *
 */	
 	
function claim_location(choice, game){
	
	/* 1 */
	
	for(i = 0; i < polygons.length; i++){
		
		/* 2 */
		
		if(map.checkGeofence(position.coords.latitude, position.coords.longitude, polygons[i])){
			
			/* 3 */
			
			if(choice == 1){
				
				// Set As Vampire
				polygons[i].setOptions({fillColor: game.style.vampire, fillOpacity: 0.5});
				game.grid[i] = 1;
				
			}else if(choice == 2){
				
				// Set AS Werewolf
				polygons[i].setOptions({fillColor: game.style.werewolf, fillOpacity: 0.5});
				game.grid[i] = 2;
				
			}else if(choice == 3){
				
				// Set As Ghost
				polygons[i].setOptions({fillColor: game.style.ghost, fillOpacity: 0.5});
				game.grid[i] = 3;
			
			}else if(choice == 4){
				
				// Set as Zombie
				polygons[i].setOptions({fillColor: game.style.zombie, fillOpacity: 0.5});
				game.grid[i] = 4;
				
			}
			
		}
		
	}
	
	/* 4 */
	
	var json_string = JSON.stringify(game);
	
	/* 5 */
	
	$.post("http://www.jamesrwilliams.co.uk/hybrid/api.php?request=update_game", {data: json_string}, function(result){
       
    	console.log(result);
    
    });	
	
}

/**
 *	initialise()
 *
 *	"On to scene 24, which is a smashing scene with some lovley acting"
 *
 *	=====================
 *	= Function Overview =
 *	=====================
 *
 *	1.	Clears the game and poloyons objects
 *
 *	2.	Setup the Google Map API to the page using the
 *		GMaps libary: https://hpneo.github.io/gmaps/documentation.html
 *
 *	3.	Set up the google map styles with an array from
 *		https://snazzymaps.com/style/15/subtle-grayscale 
 * 
 *	4.	Begin drawing the game grid with the drawFences()
 *		method.
 *
 *	5.	Then cycle through the grid styling it according
 *		to its occupation variable in the game object.
 *
 *	6.	Once the grid is setup then begin fetching the
 *		players location.
 *
 */		

function initialise(_data){ // jshint ignore:line
	
	/* 1 */
	
	var game = _data;
	polygons = []; 
	
	if("geolocation" in navigator) {
	
		/* 2 */
	
		map = new GMaps({
			zoom: 17,
			div: '#map-canvas',
			lat: 51.887180,
			lng: -2.088669,
			disableDefaultUI: true
		});	
		
		/* 3 */
		
		var styles = [
		
			{"featureType":"landscape","stylers":[{"saturation":-100},{"lightness":65},{"visibility":"on"}]},
			{"featureType":"poi","stylers":[{"saturation":-100},{"lightness":51},{"visibility":"simplified"}]},
			{"featureType":"road.highway","stylers":[{"saturation":-100},{"visibility":"simplified"}]},
			{"featureType":"road.arterial","stylers":[{"saturation":-100},{"lightness":30},{"visibility":"on"}]},
			{"featureType":"road.local","stylers":[{"saturation":-100},{"lightness":40},{"visibility":"on"}]},
			{"featureType":"transit","stylers":[{"saturation":-100},{"visibility":"simplified"}]},
			{"featureType":"administrative.province","stylers":[{"visibility":"off"}]},
			{"featureType":"water","elementType":"labels","stylers":[{"visibility":"on"},{"lightness":-25},{"saturation":-100}]},
			{"featureType":"water","elementType":"geometry","stylers":[{"hue":"#ffff00"},{"lightness":-25},{"saturation":-97}]}
		
		];
		
		map.setOptions({styles: styles});
		
		/* 4 */
		
		drawFences(51.888094, -2.091802, game);

		/* 5 */
	
		for(i=0; i < polygons.length; i++){
			
			if(game.grid[i] == "1"){
				
				// Vampires
				polygons[i].setOptions({fillColor: game.style.vampire, fillOpacity: game.style.active.fillOpacity, strokeWeight: 0.1});
				
		
			}else if(game.grid[i] == "2"){
				
				// Werewolf
				polygons[i].setOptions({fillColor: game.style.werewolf, fillOpacity: game.style.active.fillOpacity, strokeWeight: 0.1});
	
				
			}else if(game.grid[i] == "3"){
				
				// Ghost
				polygons[i].setOptions({fillColor: game.style.ghost, fillOpacity: game.style.active.fillOpacity, strokeWeight: 0.1});
				
			}else if(game.grid[i] == "4"){
				
				// Zombie
				polygons[i].setOptions({fillColor: game.style.zombie, fillOpacity: game.style.active.fillOpacity, strokeWeight: 0.1});
				
			}else {
				
				// Not Occupied
				polygons[i].setOptions({fillColor: "#FFFFFF", fillOpacity: 0.1,  strokeWeight: 0.1});
				
			}
			
		}
		
		/* 6 */
		
		init_geo();
		
		
	} else {
		
		alert("Geolocation Is Unavailable");
				
	}

}                                                                                    