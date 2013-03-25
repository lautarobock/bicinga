chrome.browserAction.setIcon({path:"img/green.png"});

var loopTimeout;

var lastValue = -1;

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
					//var total = parseInt(json[0].StationAvailableBikes);
					var total = 0;
					var title = "";
					for ( var i=0; i<json.length; i++) {
						total += parseInt(json[i].StationAvailableBikes);
						title += json[i].StationID + " // ";
					}
					if ( json.length == 1) {
						title = format(json[0].StationName);
					}
					if ( total != lastValue ) {
						var icon;
						var text = "";
						if ( total == 0 ) {
							text = 'No tiene mas bicicletas disponibles en la estacion.';
							icon = "img/red.png";
						} else if ( total < 5 ) {
							icon = "img/orange.png";
						} else {
							icon = "img/green.png";
						}
						if ( total != 0 && lastValue != -1 && total > lastValue ) {
							text = 'Tiene '+(total-lastValue)+' bicis nuevas.';
						}
						if ( total != 0 && lastValue != -1 && total < lastValue ) {
							text = 'Tiene '+(lastValue-total)+' bicis menos.';
						}
						text = text + "Total: " + total;
						showNotification(icon,title,text);
						chrome.browserAction.setIcon({path:icon});
					}			
					lastValue = total;
					chrome.browserAction.setBadgeText({text: ""+(total)})
					
					
					chrome.browserAction.setTitle({title:title + ": " + total});
				} else {
					chrome.browserAction.setIcon({path:"img/black.png"});
					chrome.browserAction.setBadgeText({text: "X"})
					chrome.browserAction.setTitle({title:"None: X"});
				}
		    }
		);	
	} else {
		chrome.browserAction.setIcon({path:"img/black.png"});
		chrome.browserAction.setBadgeText({text: "X"})
		chrome.browserAction.setTitle({title:"None: X"});
	}

}

function launchLoop() {
	clearInterval(loopTimeout);
	if ( localStorage["enabled"] == "true" ) {
		lastValue = -1;
		var pollingTime = localStorage["pollingTime"] || 5;
		pollingTime = pollingTime * 1000;
		refresh();
		loopTimeout = setInterval(refresh,pollingTime);
	} else {
		chrome.browserAction.setIcon({path:"img/black.png"});
		chrome.browserAction.setBadgeText({text: "X"})
		chrome.browserAction.setTitle({title:"None: X"});		
	}
}

launchLoop();

function showNotification(icon,title,text) {
	var notification = webkitNotifications.createNotification(
	  icon,
	  title,
	  text
	);
	
	notification.show();
	setTimeout(function() {
		notification.cancel();
	},8000);	
}

function format(string) {
	return string.replace('&Agrave;','Á');
}
