chrome.browserAction.setIcon({path:"img/green.png"});

var lastValue = -1;
function refresh() {
	var StationID = localStorage["StationID"];
	if ( StationID ) {
		StationID = parseInt(StationID);
		$.getJSON(
		    "http://bicinga.eu01.aws.af.cm/bicing",
		    {stations: [StationID]},
		    function(json) {
				//var total = parseInt(json[0].StationAvailableBikes) + parseInt(json[1].StationAvailableBikes);
				var total = parseInt(json[0].StationAvailableBikes);
				if ( total != lastValue ) {
					if ( total == 0 ) {
						showNotification('img/red.png',''+StationID+': ' + format(json[0].StationName),'No tiene mas bicicletas disponibles en la estacion');
						chrome.browserAction.setIcon({path:"img/red.png"});
					} else if ( total < 5 ) {
						chrome.browserAction.setIcon({path:"img/orange.png"});
					} else {
						chrome.browserAction.setIcon({path:"img/green.png"});
					}
					if ( total != 0 && lastValue != -1 && total > lastValue ) {
						showNotification('img/green.png',''+StationID+': ' + format(json[0].StationName),'Tiene '+(total-lastValue)+' bicis nuevas');
					}
					if ( total != 0 && lastValue != -1 && total < lastValue ) {
						showNotification('img/orange.png',''+StationID+': ' + format(json[0].StationName),'Tiene '+(lastValue-total)+' bicis menos');
					}
				}			
				lastValue = total;
				chrome.browserAction.setBadgeText({text: ""+(total)})
				setTimeout(refresh,5000);
		    }
		);	
	} else {
		chrome.browserAction.setIcon({path:"img/black.png"});
		chrome.browserAction.setBadgeText({text: "X"})
		setTimeout(refresh,5000);	
	}

}

refresh();

function showNotification(icon,title,text) {
	var notification = webkitNotifications.createNotification(
	  icon,
	  title,
	  text
	);
	
	notification.show();
	setTimeout(function() {
		notification.cancel();
	},3000);	
}

function format(string) {
	return string.replace('&Agrave;','Á');
}
