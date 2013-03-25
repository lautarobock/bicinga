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



document.addEventListener('DOMContentLoaded', function () {
	document.querySelector('button').addEventListener('click', saveOptions);
	$('#StationID').val(localStorage["StationID"]);
	$('#pollingTime').val(localStorage["pollingTime"]);
	$('#enabled').attr('checked', localStorage["enabled"]=="true");
});


function isNumber(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}
