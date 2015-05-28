/*
 * Functions Library for the Hybrid Game App
 * -------------------
 *
 * By @James_RWilliams
 *
 * 25/05/15
 *
 */
 
 function login(){
	 
	 console.log("Login Started");
	 
	 var _user = $(".login #username").val();
	 var _pass = $(".login #password").val();
	 
	console.log("Username: " +  _user);
	console.log("Password: " +  $.md5(_pass));
	
	// WRITE TO LS
 	 
 }
 
 function drawLore(data){
		
	console.log(data);	
		
	$.each(data, function(i, value){
		
		$("#lore_output").append("<a class='item'><h2>" + value.title + "</h2><p>" + value.text + "</p>");
		
	});
	 
 }

function getLoreData(){
	
	$("#lore_output").text("Fetching Data");
	
	var request = new XMLHttpRequest();
	
	request.open('GET', 'http://www.the-hybrid.co.uk/api.php?request=get_lore_posts', true);

	request.onload = function() {
	if (request.status >= 200 && request.status < 400) {
    
    	// Success!
		var data = JSON.parse(request.responseText);
    
		console.log(data);
		
		setData(data);
	
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
 


/* 
 * ========================================================================================================================	
 * 	
 *  	888888888888  88        88  88888888888        ,ad8888ba,          db         88b           d88  88888888888 
 *      	 88       88        88  88                d8"'    `"8b        d88b        888b         d888  88           
 *  	 	 88       88        88  88               d8'                 d8'`8b       88`8b       d8'88  88           
 *  	 	 88       88aaaaaaaa88  88aaaaa          88                 d8'  `8b      88 `8b     d8' 88  88aaaaa     
 *  	 	 88       88""""""""88  88"""""          88      88888     d8YaaaaY8b     88  `8b   d8'  88  88"""""      
 *  	 	 88       88        88  88               Y8,        88    d8""""""""8b    88   `8b d8'   88  88           
 *  	 	 88       88        88  88                Y8a.    .a88   d8'        `8b   88    `888'    88  88           
 *  	 	 88       88        88  88888888888        `"Y88888P"   d8'          `8b  88     `8'     88  88888888888
 * 																	
 * ========================================================================================================================                                                                                                           
 */


/*
== Final Variables 
*/

var game = new Object();

var position = new Object();

/*
== 
*/


var test_lat = 51.887761;
var test_lng = -2.088182;

var map, i, output, test_marker;

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
	
	output.innerHTML = output.innerHTML + "<p>Geolocation Fetch Fail</p>";
	
}


function drawFences(origin_lat, origin_lng, game){
	

	var length = 10;
	var iter = 10;
	
	var offset = 0.000300;
	var oddTab = 0.000270;
	
	/*	
	 *	Generate the Grid System 
	 */
	 
	for(count = 0; count < game.setup.height; count++){
		
		if(isEven(count)){
			
			for(i = 0; i < game.setup.width; i++){

				var lat_offset = (i * 0);
				var lng_offset = (i * -0.00054);
		
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
		
		else if(isOdd(count)){
			
			for(i = 0; i < game.setup.width-1; i++){

				var lat_offset = (i * 0);
				var lng_offset = (i * -0.00054);
		
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
	
	test_marker = map.addMarker({
	
		lat: test_lat,
		lng: test_lng,
		title: "Test",
		click: function(e){
		
			output.innerHTML = output.innerHTML + "<p>This is the Test Marker </p>";	
			
		}	
		
	});	
	
	// Enable Claim_button / disable loading animation
	
	$("#claimBtn").removeAttr('disabled');
	
 
};

function init_geo(){
	
	navigator.geolocation.getCurrentPosition(locationSuccess, locationError);
	
	map.removeMarkers();
	
}

function claim_location(choice, game){
	
	// 0 - Get user claim choice
	
	// alert(choice);
	
	// 1 - Find Location
	
	for(i = 0; i < polygons.length; i++){
		
		if(map.checkGeofence(test_lat, test_lng, polygons[i]) || map.checkGeofence(position.coords.latitude, position.coords.longitude, polygons[i])){
			
			console.log("Active Grid: " + i + " - Current Value: " + game.grid[i]);
			
			if(choice == 1){
				
				// Set As Vampire
				polygons[i].setOptions({fillColor: game.style.vampire, fillOpacity: 1});
				game.grid[i] = 1;
				
			}else if(choice == 2){
				
				// Set AS Werewolf
				polygons[i].setOptions({fillColor: game.style.werewolf, fillOpacity: 1});
				game.grid[i] = 2;
				
			}else if(choice == 3){
				
				// Set As Ghost
				polygons[i].setOptions({fillColor: game.style.ghost, fillOpacity: 1});
				game.grid[i] = 3;
			
			}else if(choice == 4){
				
				// Set as Zombie
				polygons[i].setOptions({fillColor: game.style.zombie, fillOpacity: 1});
				game.grid[i] = 4;
				
			}
			
			console.log("New Value: " + game.grid[i]);
			
		}
		
	}
	
	var json_string = JSON.stringify(game);
	
	$.post("http://www.jamesrwilliams.co.uk/hybrid/api.php?request=update_game", {data: json_string}, function(result){
       
       for(i=0; i < result.length; i++){
	       
	       console.log(result[i]);
	       
       }
       
      	console.log(result.length);
    
    });	
	
	// 2 - Change its stats
	
	// 3 - Send back to server
	
	// 4 - on completeion refresh
	
	// initialise(game);
	
};

function initialise(_data){
	
	var game = _data;
	
	//console.log(game);
	
	if("geolocation" in navigator) {
	
		// GMAPS Docs - https://hpneo.github.io/gmaps/documentation.html
	
		map = new GMaps({
			zoom: 17,
			div: '#map-canvas',
			lat: 51.887180,
			lng: -2.088669,
			disableDefaultUI: true
		});	
	
	
		var styles = [
		
			{"featureType":"all","elementType":"labels.text.fill","stylers":[{"saturation":36},{"color":"#000000"},{"lightness":40}]},
			{"featureType":"all","elementType":"labels.text.stroke","stylers":[{"visibility":"on"},{"color":"#000000"},{"lightness":16}]},
			{"featureType":"all","elementType":"labels.icon","stylers":[{"visibility":"off"}]},
			{"featureType":"administrative","elementType":"geometry.fill","stylers":[{"color":"#000000"},{"lightness":20}]},
			{"featureType":"administrative","elementType":"geometry.stroke","stylers":[{"color":"#000000"},{"lightness":17},{"weight":1.2}]},
			{"featureType":"administrative.locality","elementType":"labels.text.fill","stylers":[{"hue":"#ff0000"},{"lightness":"100"}]},
			{"featureType":"administrative.neighborhood","elementType":"labels.text.fill","stylers":[{"color":"#ffffff"}]},
			{"featureType":"landscape","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":20}]},
			{"featureType":"landscape.man_made","elementType":"geometry.fill","stylers":[{"lightness":"7"}]},
			{"featureType":"poi","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":21}]},
			{"featureType":"poi.park","elementType":"geometry.fill","stylers":[{"color":"#48d1af"}]},
			{"featureType":"poi.park","elementType":"labels.text.fill","stylers":[{"color":"#66b0ff"}]},
			{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#000000"},{"lightness":17}]},
			{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#000000"},{"lightness":29},{"weight":0.2}]},
			{"featureType":"road.highway","elementType":"labels.text","stylers":[{"visibility":"off"}]},
			{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":18}]},
			{"featureType":"road.arterial","elementType":"labels.text","stylers":[{"visibility":"off"}]},
			{"featureType":"road.arterial","elementType":"labels.text.fill","stylers":[{"lightness":"100"},{"visibility":"off"}]},
			{"featureType":"road.arterial","elementType":"labels.text.stroke","stylers":[{"visibility":"off"}]},
			{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":16}]},
			{"featureType":"road.local","elementType":"geometry.fill","stylers":[{"visibility":"off"}]},
			{"featureType":"road.local","elementType":"labels.text","stylers":[{"visibility":"on"}]},
			{"featureType":"road.local","elementType":"labels.text.fill","stylers":[{"lightness":"100"},{"visibility":"on"}]},
			{"featureType":"transit","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":19}]},
			{"featureType":"transit.station.bus","elementType":"labels.text.fill","stylers":[{"hue":"#ff0000"}]},
			{"featureType":"water","elementType":"geometry","stylers":[{"color":"#4aceae"},{"lightness":17}]},
			{"featureType":"water","elementType":"geometry.fill","stylers":[{"lightness":"100"}]}
			
		];
	
		map.setOptions({styles: styles});
	
		drawFences(51.888860, -2.091646, game);
	
	/*
	
		- 1 Vampire
		- 2 Werewolf
		- 3 Ghost
		- 4 Zombie
		- 5 OTS
		- 6 Free	
		
	*/
	
	for(i=0; i < polygons.length; i++){
		
		// console.log("Grid: " + i + " - " + game.grid[i]);
		
		if(game.grid[i] === "1"){
			
			// Vampires
			polygons[i].setOptions({fillColor: game.style.vampire, fillOpacity: game.style.active.fillOpacity});
			
	
		}else if(game.grid[i] == "2"){
			
			// Werewolf
			polygons[i].setOptions({fillColor: game.style.werewolf, fillOpacity: game.style.active.fillOpacity});

			
		}else if(game.grid[i] == "3"){
			
			// Ghost
			polygons[i].setOptions({fillColor: game.style.ghost, fillOpacity: game.style.active.fillOpacity});
			
		}else if(game.grid[i] == "4"){
			
			// Zombie
			polygons[i].setOptions({fillColor: game.style.zombie, fillOpacity: game.style.active.fillOpacity});
			
		}else {
			
			// Not Occupied
			polygons[i].setOptions({fillColor: "#FFFFFF", fillOpacity: 0.1});
			
		}
		
	}
	
	init_geo();
	
	
} else {
	
	//TODO SupportiveErrorMessage - Geolocation Is Unavlaible 
	
}

	
}                                                                                    

