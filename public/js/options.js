function saveOptions() {
	clearErrors();
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
		showMessage("Opciones guardadas");
	} else {
		showErrors(errors);
	}

}

function cancelOptions() {
	location.reload();
}

function clearErrors() {
	$('#status-error').html("");
	$('#status-error').css("display","none");
}
function showErrors(errors) {
	var text = "";
	for ( var i=0; i<errors.length; i++ ) {
		text += '<span>';
		text += errors[i];
		text += '</span>';
	}
	$('#status-error').css("display","block");
	$('#status-error').html(text);
}

function showMessage(text,delay) {
	$('#status').css("display","block");
	$('#status').html(text);
	setTimeout(function() {
		$('#status').html("");
		$('#status').css("display","none");
	}, delay||1000);
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
    showStationData(station, miLat, miLng);
}

function showStationData(station,miLat,miLng) {
	var gmURL = "https://maps.google.es/maps?saddr=@sourceLat@,@sourceLng@&daddr=@targetLat@,@targetLng@&t=m&z=17&dirflg=w";
    gmURL = gmURL.replace("@sourceLat@",miLat);
    gmURL = gmURL.replace("@sourceLng@",miLng);
    gmURL = gmURL.replace("@targetLat@",station.AddressGmapsLatitude);
    gmURL = gmURL.replace("@targetLng@",station.AddressGmapsLongitude);
    $('#StationName').html(station.StationName + " (<a target='gmap' href='"+gmURL+"' style='padding:0' class='btn btn-link'>Como llegar</a>)");
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

/**
 * Devuelve las coordenadas guardadas si las hubiese y si no las de HTML5 si fuese posible
 * @param callback
 */
function getFinalCoords(callback) {
	var miLat = localStorage["latitud"];
	var miLng = localStorage["longitud"];
	if ( !miLat && !miLng && navigator.geolocation ) { 
        getCurrentPosition(function(position) {
            callback(position.coords.latitude, position.coords.longitude);
        });
	} else if ( miLat && miLng ) {
		callback(miLat, miLng);
    } else {
    	callback(null,null,"No es posible obtener coordenadas");
    }
}

function changeStationID() {
	var values = $('#StationID').val().split(",");
	var text = "";
//	if ( (values instanceof Array) ) {
//		values = values[0];
//	}
	$.getJSON(
	    "http://bicinga.eu01.aws.af.cm/bicing",
		{stations:values},
	    function(json) {
			if ( json && json.length > 0 ) {
				for ( var i=0; i<json.length; i++ ) {	
					//Lo hago solo con la primera
					if ( json[i].StationID == values[0]) {
						var station = json[i];
						getFinalCoords(function(lat,lng,err) {
							if ( !err ) {
								showStationData(station, lat, lng);	
							} else {
								alert(err);
							}
						});
					}
				}
			}
	    }
	);
}

function displayError(error) {
	showMessage(error.code);
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
		};
		getCurrentPosition(displayPosition);
	} else {
		showMessage("Geolocation is not supported by this browser");
	}
}

document.addEventListener('DOMContentLoaded', function () {
	document.getElementById('btnSave').addEventListener('click', saveOptions);
	document.getElementById('btnCancel').addEventListener('click', cancelOptions);
	document.getElementById('btnNearest').addEventListener('click', getNearest);
	document.getElementById('btnMyCoord').addEventListener('click', getMyCoord);

	loadStoreData();
});

function loadStoreData() {
	$('#StationID').change(changeStationID);
	$('#StationID').val(localStorage["StationID"]);	
	changeStationID();
	$('#pollingTime').val(localStorage["pollingTime"]);
	$('#enabled').removeAttr('checked');
	$('#enabled').attr('checked', localStorage["enabled"]=="true");
	$('#latitud').val(localStorage["latitud"]);
	$('#longitud').val(localStorage["longitud"]);
}


function isNumber(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}
