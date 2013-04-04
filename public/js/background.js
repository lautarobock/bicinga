chrome.browserAction.setIcon({path:"img/green.png"});

var loopTimeout;

var values = {};

function refresh() {
	var StationID = localStorage["StationID"];
	if ( StationID ) {
		//StationID = parseInt(StationID);
		StationID = StationID.split(",");
		$.getJSON(
		    "http://bicinga.eu01.aws.af.cm/bicing",
		    //{stations: [StationID]},
			{stations: StationID},
		    function(json) {
				if ( json && json.length > 0 ) {
					var total = 0;
					for ( var i=0; i<json.length; i++ ) {						
						var stationActual = parseInt(json[i].StationAvailableBikes);
						var stationLast = values[json[i].StationID];
						if ( typeof stationLast === "undefined" ) {
							stationLast = -1;
						}
						values[json[i].StationID] = stationActual;
						total += stationActual;
						if ( stationActual != stationLast ) {
							var icon;
							var text = "";
							if ( stationActual == 0 ) {
								text = 'No tiene mas bicicletas disponibles en la estacion.';
								icon = "img/red.png";
							} else if ( stationActual < 5 ) {
								icon = "img/orange.png";
							} else {
								icon = "img/green.png";
							}
							if ( stationActual != 0 && stationLast != -1 && stationActual > stationLast ) {
								text = 'Tiene '+(stationActual-stationLast)+' bicis nuevas.';
							}
							if ( stationActual != 0 && stationLast != -1 && stationActual < stationLast ) {
								text = 'Tiene '+(stationLast-stationActual)+' bicis menos.';
							}
							text = text + "Total: " + stationActual;
							showNotification(icon,json[i].StationName,text);
						}	
					}
					if ( total == 0 ) {
						chrome.browserAction.setIcon({path:"img/red.png"});
					} else if ( total < 5 ) {
						chrome.browserAction.setIcon({path:"img/orange.png"});
					} else {
						chrome.browserAction.setIcon({path:"img/green.png"});
					}
					
					chrome.browserAction.setBadgeText({text: ""+(total)});
					
					chrome.browserAction.setTitle({title: "" + json.length + " estaciones: " + total});
				} else {
					chrome.browserAction.setIcon({path:"img/black.png"});
					chrome.browserAction.setBadgeText({text: "X"});
					chrome.browserAction.setTitle({title:"None: X"});
				}
		    }
		);	
	} else {
		chrome.browserAction.setIcon({path:"img/black.png"});
		chrome.browserAction.setBadgeText({text: "X"});
		chrome.browserAction.setTitle({title:"None: X"});
	}

}

function launchLoop() {
	clearInterval(loopTimeout);
	if ( localStorage["enabled"] == "true" ) {
		values = {};
		var pollingTime = localStorage["pollingTime"] || 5;
		pollingTime = pollingTime * 1000;
		refresh();
		loopTimeout = setInterval(refresh,pollingTime);
	} else {
		chrome.browserAction.setIcon({path:"img/black.png"});
		chrome.browserAction.setBadgeText({text: "X"});
		chrome.browserAction.setTitle({title:"None: X"});		
	}
}

launchLoop();


function showNotification(icon,title,text) {
	var time = localStorage["popupTime"] || 8;
	time = time * 1000;
	var notification = webkitNotifications.createNotification(
	  icon,
	  format(title),
	  text
	);
	
	notification.show();
	setTimeout(function() {
		notification.cancel();
	},time);	
}

function format(string) {
//	return string.replace('&Agrave;','Á');
	return entityToHtml(string);
}

