/*
 * The-Hybrid Companion - Lib.js
 *
 * Sets the AngularJS states and modules used in the app. 
 * Allocating the controllers and templates forming the 
 * app's structure.
 * 
 * @version		1.0
 * @package		com.wearekiwikiwi.hybrid
 * @description	Functions Library for The Hybrid Companion App			
 * @author 		James Williams (@James_RWilliams)
 * @copyright 	Copyright (c) 30/05/2015
 *
 */
 
 var alert;
 
 function login(){
	 
	 
	 var _user = $(".login #username").val();
	 var _pass = $(".login #password").val();
	 
	console.log("Username: " +  _user);
	console.log("Password: " +  $.md5(_pass));
 	 
 }
 
/*
 * ========================================================================================================================
 * 
 * 		8888888888 8888888888 88888888888  .d8888b.  888    888       888       .d88888b.  8888888b.  8888888888 
 * 		888        888            888     d88P  Y88b 888    888       888      d88P" "Y88b 888   Y88b 888        
 *  	888        888            888     888    888 888    888       888      888     888 888    888 888        
 * 		8888888    8888888        888     888        8888888888       888      888     888 888   d88P 8888888    
 *		888        888            888     888        888    888       888      888     888 8888888P"  888        
 * 		888        888            888     888    888 888    888       888      888     888 888 T88b   888        
 * 		888        888            888     Y88b  d88P 888    888       888      Y88b. .d88P 888  T88b  888        
 * 		888        8888888888     888      "Y8888P"  888    888       88888888  "Y88888P"  888   T88b 8888888888
 *
 * ========================================================================================================================
 */
 
/**
 * Renders the Lore Data from the server into the DOM
 * 
 */ 
 
function drawLore(data){
		
	$.each(data, function(i, value){
		
		$("#lore_output").append("<div class='item item-wrap'><h2>" + value.title + "</h2><p>" + value.text + "</p></div>");
		
	});
	 
}

function getLoreData(){
	
	$("#lore_output").text("Fetching Data");
	
	var request = new XMLHttpRequest();
	
	request.open('GET', 'http://www.the-hybrid.co.uk/api.php?request=get_lore_posts', true);

	request.onload = function() {
	if (request.status >= 200 && request.status < 400) {
   	
		setData(JSON.parse(request.responseText));
	
	} else {
	
		$("#lore_output").text("Error Fetching Data");
	
	}

};

request.onerror = function() {

	$("#lore_output").text("Error Connecting To Server");

};

request.send();
	
}

function setData(input_data){
	
	$(document).ready(function(){
		
		
		
		$("#lore_output").text(input_data);
		
	});
	
}


/* ===================================================================================================================	
 * 	
 *  888888888888  88        88  88888888888        ,ad8888ba,          db         88b           d88  88888888888 
 *       88       88        88  88                d8"'    `"8b        d88b        888b         d888  88           
 *  	 88       88        88  88               d8'                 d8'`8b       88`8b       d8'88  88           
 *  	 88       88aaaaaaaa88  88aaaaa          88                 d8'  `8b      88 `8b     d8' 88  88aaaaa     
 *  	 88       88""""""""88  88"""""          88      88888     d8YaaaaY8b     88  `8b   d8'  88  88"""""      
 *  	 88       88        88  88               Y8,        88    d8""""""""8b    88   `8b d8'   88  88           
 *  	 88       88        88  88                Y8a.    .a88   d8'        `8b   88    `888'    88  88           
 *  	 88       88        88  88888888888        `"Y88888P"   d8'          `8b  88     `8'     88  88888888888
 * 																	
 * ================================================================================================================ */                                                                                                          

var game = new Object();
var position = new Object();
var map, i, output;
var polygons = [];

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

function isNumber(n){
	
   return n == parseFloat(n);
   
}
function isEven(n){
	
   return isNumber(n) && (n % 2 === 0);
   
}

function isOdd(n){
	
   return isNumber(n) && (Math.abs(n) % 2 === 1);
   
}

function locationError(){
	
	alert("ERROR: Could Not Get Location Data");
	
}

/**
 *	DrawFences maps out the polgons for the Geolocation Game: Infection
 *	
 *	@parameter Origin_lat	- The starting Latitude of the game grid
 *	@parameter Orgin_lang 	- The starting Longitude of the game grid
 *	@parameter game	   		- The game data object
 *
 *
 *	===================
 *	Function Overview
 *	===================
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

var locationSuccess = function(_position) {
		
	position = _position;	
		
	var player = map.addMarker({
	
		lat: position.coords.latitude,
		lng: position.coords.longitude,
		title: 'You',
		click: function(e) {
			
			output.innerHTML = output.innerHTML + "<p>This is your location</p>";
		
		}
	});
	
	$("#claimBtn").removeAttr('disabled');
 
}

function init_geo(){
	
	navigator.geolocation.getCurrentPosition(locationSuccess, locationError);
	
	map.removeMarkers();
	
}

function claim_location(choice, game){
	
	for(i = 0; i < polygons.length; i++){
		
		if(map.checkGeofence(position.coords.latitude, position.coords.longitude, polygons[i])){
						
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
	
	var json_string = JSON.stringify(game);
	
	$.post("http://www.jamesrwilliams.co.uk/hybrid/api.php?request=update_game", {data: json_string}, function(result){
       
    	console.log(result);
    
    });	
    
    
	
}

function initialise(_data){
	
	var game = _data; // Specifiy the passed object from the controller to the funtion.
	
	polygons = []; // Reset the grid length so it replaces rather than appends to the data.
	
	if("geolocation" in navigator) {
	
		// Draw Google Maps using GMAPS - Docs: https://hpneo.github.io/gmaps/documentation.html
		map = new GMaps({
			zoom: 17,
			div: '#map-canvas',
			lat: 51.887180,
			lng: -2.088669,
			disableDefaultUI: true
		});	
		
		// Google Maps API Styles from: https://snazzymaps.com/style/15/subtle-grayscale 
		
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
		
		// Style the Maps with the colour scheme from above.
		map.setOptions({styles: styles});
		
		drawFences(51.888094, -2.091802, game);
	
		/*
		 * Style the Grid based on the settings in the game string. Chaning their colours etc.
		 *
		 */
	
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
		
		init_geo();
		
		
	} else {
		
		alert("Geolocation Is Unavailable");
				
	}

}                                                                                    