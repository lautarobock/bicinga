function saveOptions() {

	//validations
	var errors = [];
	
	// pollingTime	
	var pollingTime = $('#pollingTime').val();
	if ( !isNumber(pollingTime) || parseInt(pollingTime) <= 0 ) {
		errors.push("El Tiempo de refresco debe ser un valor numerico y positivo");
	} else {
		pollingTime = parseInt(pollingTime);
	}

	if ( errors.length == 0 ) {
		localStorage["StationID"] = $('#StationID').val();
		localStorage["pollingTime"] = pollingTime;
		localStorage["enabled"] = $('#enabled').is(":checked");
		localStorage["latitud"] = $('#latitud').val();
		localStorage["longitud"] = $('#longitud').val();
		
		chrome.runtime.getBackgroundPage(function(bg) {
			bg.launchLoop();
		});

		

		// Update status to let user know options were saved.
		var status = document.getElementById("status");
		status.innerHTML = "Options Saved.";
		setTimeout(function() {
		status.innerHTML = "";
		}, 750);	
	} else {
		var text = "";
		for ( var i=0; i<errors.length; i++ ) {
			text += '<p class="text-error">';
			text += errors[i];
			text += '</p>';
		}
		$('#status').html(text)
	}

}

var SCALE = 1000000;
function getNearest() {
	$.getJSON(
	    "http://bicinga.eu01.aws.af.cm/bicing",
		{},
	    function(json) {
			if ( json && json.length > 0 ) {
				var miLat = localStorage["latitud"]*SCALE;
				var miLng = localStorage["longitud"]*SCALE;
				if ( !miLat && !miLng && navigator.geolocation ) {
					
				}
				if ( miLat && miLng ) {
					var actual;
					var station;
					for ( var i=0; i<json.length; i++ ) {		
						var lat = json[i].AddressGmapsLatitude*SCALE;
						var lng = json[i].AddressGmapsLongitude*SCALE;
						var dist = Math.sqrt(Math.pow(miLat-lat,2)+Math.pow(miLng-lng,2));
						if ( !actual || dist < actual ) {
							actual = dist;
							station = json[i];
						}
					}
					$('#StationID').val(station.StationID);
					$('#StationName').html(station.StationName);
				}
			}
	    }
	);	
}



function changeStationID() {
	var values = $('#StationID').val();
	var text = "";
	if ( (values instanceof Array) ) {
		values = values[0];
	}
	$.getJSON(
	    "http://bicinga.eu01.aws.af.cm/bicing",
		{},
	    function(json) {
			if ( json && json.length > 0 ) {
				for ( var i=0; i<json.length; i++ ) {		
					if ( json[i].StationID == values ) {
						$('#StationName').html(json[i].StationName);
					}
				}
			}
	    }
	);
}

function getMyCoord() {
	if (navigator.geolocation) {
		var timeoutVal = 10 * 1000 * 1000;
		var displayPosition = function(position) {			
			$('#latitud').val(position.coords.latitude);
			$('#longitud').val(position.coords.longitude);
		}
		var displayError = function (error) {
			var status = document.getElementById("status");
			status.innerHTML = error.code;
			setTimeout(function() {
				status.innerHTML = "";
			}, 750);
		}
		navigator.geolocation.getCurrentPosition(displayPosition, displayError, { enableHighAccuracy: true, timeout: timeoutVal, maximumAge: 0 });
	} else {
		var status = document.getElementById("status");
		status.innerHTML = "Geolocation is not supported by this browser";
		setTimeout(function() {
			status.innerHTML = "";
		}, 750);
	}
}

document.addEventListener('DOMContentLoaded', function () {
//	document.querySelector('button').addEventListener('click', saveOptions);
	document.getElementById('btnSave').addEventListener('click', saveOptions);
	document.getElementById('btnNearest').addEventListener('click', getNearest);
	document.getElementById('btnMyCoord').addEventListener('click', getMyCoord);

	$('#StationID').change(changeStationID);
	$('#StationID').val(localStorage["StationID"]);	
	changeStationID();
	$('#pollingTime').val(localStorage["pollingTime"]);
	$('#enabled').attr('checked', localStorage["enabled"]=="true");
	$('#latitud').val(localStorage["latitud"]);
	$('#longitud').val(localStorage["longitud"]);
});


function isNumber(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}
