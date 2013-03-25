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
					var icon;
					if ( total == 0 ) {
						icon = "img/red.png";
					} else if ( total < 5 ) {
						icon = "img/orange.png";
					} else {
						icon = "img/green.png";
					}
					$("#content").fadeOut(300,function() {
						$("#label1").html(json[0].StationName + ": ");
				        $("#spaces1").html(json[0].StationAvailableBikes);
						$("#icon1").attr("src",icon);
						$("#content").fadeIn(300,function() {
							//setTimeout(refresh,3000);
						});
					});
				} else {
					
				}
			
		    }
		);
	} else {
		$("#label1").html("--");
        $("#spaces1").html("--");
	}
}

refresh();

