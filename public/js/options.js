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
function internalGetNearest(json, miLat, miLng) {
    var actual;
    var station;
    var miLatS = miLat*SCALE;
    var miLngS = miLng*SCALE;

    for (var i = 0; i < json.length; i++) {
        var lat = json[i].AddressGmapsLatitude * SCALE;
        var lng = json[i].AddressGmapsLongitude * SCALE;
        var dist = Math.sqrt(Math.pow(miLatS - lat, 2) + Math.pow(miLngS - lng, 2));
        if (!actual || dist < actual) {
            actual = dist;
            station = json[i];
        }
    }
    $('#StationID').val(station.StationID);
    var gmURL = "https://maps.google.es/maps?saddr=@sourceLat@,@sourceLng@&daddr=@targetLat@,@targetLng@&t=m&z=17&dirflg=w";
    gmURL = gmURL.replace("@sourceLat@",miLat);
    gmURL = gmURL.replace("@sourceLng@",miLng);
    gmURL = gmURL.replace("@targetLat@",station.AddressGmapsLatitude);
    gmURL = gmURL.replace("@targetLng@",station.AddressGmapsLongitude);
    $('#StationName').html(station.StationName + " (<a href='"+gmURL+"' class='btn btn-link'>Como llegar</a>)");
}
function getNearest() {
	$.getJSON(
	    "http://bicinga.eu01.aws.af.cm/bicing",
		{},
	    function(json) {
			if ( json && json.length > 0 ) {
				var miLat = localStorage["latitud"];
				var miLng = localStorage["longitud"];
				if ( !miLat && !miLng && navigator.geolocation ) {
                    var displayPosition = function(position) {
                        internalGetNearest(json, position.coords.latitude, position.coords.longitude);
                    }
                    getCurrentPosition(displayPosition);
				}
				if ( miLat && miLng ) {
                    internalGetNearest(json, miLat, miLng);
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

function displayError(error) {
    var status = document.getElementById("status");
    status.innerHTML = error.code;
    setTimeout(function() {
        status.innerHTML = "";
    }, 750);
}

function getCurrentPosition(callback) {
    var timeoutVal = 10 * 1000 * 1000;
    navigator.geolocation.getCurrentPosition(callback, displayError, { enableHighAccuracy: true, timeout: timeoutVal, maximumAge: 0 });
}

function getMyCoord() {
	if (navigator.geolocation) {
		var displayPosition = function(position) {
			$('#latitud').val(position.coords.latitude);
			$('#longitud').val(position.coords.longitude);
		}
		getCurrentPosition(displayPosition);
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
