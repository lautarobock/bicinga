function refresh() {
	var StationID = localStorage["StationID"];
	if ( StationID ) {
		StationID = parseInt(StationID);
		$.getJSON(
		    "http://bicinga.eu01.aws.af.cm/bicing",
		    {stations: [StationID]},
		    function(json) {
				$("#content").fadeOut(300,function() {
					$("#label1").html(json[0].StationName);
		            $("#spaces1").html(json[0].StationAvailableBikes);
					$("#content").fadeIn(300,function() {
						setTimeout(refresh,3000);
					});
				});
			
		    }
		);
	} else {
		$("#label1").html("--");
        $("#spaces1").html("--");
	}
}

refresh();

