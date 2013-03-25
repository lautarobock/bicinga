chrome.browserAction.setIcon({path:"img/green.png"});

var loopTimeout;

var lastValue = -1;

function refresh() {
	var StationID = localStorage["StationID"];
	if ( StationID ) {
		StationID = parseInt(StationID);
		$.getJSON(
		    "http://bicinga.eu01.aws.af.cm/bicing",
		    {stations: [StationID]},
		    function(json) {
				if ( json && json.length > 0 ) {
					var total = parseInt(json[0].StationAvailableBikes);
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
						showNotification(icon,format(json[0].StationName),text);
						chrome.browserAction.setIcon({path:icon});
					}			
					lastValue = total;
					chrome.browserAction.setBadgeText({text: ""+(total)})
					chrome.browserAction.setTitle({title:format(json[0].StationName) + ": " + total});
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
	lastValue = -1;
	var pollingTime = localStorage["pollingTime"] || 5;
	pollingTime = pollingTime * 1000;
	refresh();
	loopTimeout = setInterval(refresh,pollingTime);
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
	},5000);	
}

function format(string) {
	return string.replace('&Agrave;','Á');
}
