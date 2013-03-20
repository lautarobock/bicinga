var http = require('http');

var opt = {
	hostname: 'www.bicing.cat',
	port: 80,
	path: '/localizaciones/getJsonObject.php',
	method: 'GET'
};

var msg = "";

var req = http.request(opt, function(res) {
	//console.log('STATUS:' + res.statusCode);
	//console.log('HEADERS:' + JSON.stringify(res.handlers));
	res.setEncoding('utf8');
	res.on('data', function(chunk) {
		//console.log(chunk);
		msg += chunk;
	});
	res.on('end', function() {
		//console.log(msg);
		var object = eval("("+msg+")");
		
		for(var i=0; i<object.length; i++ ) {
			if ( process.argv.length <=2 ) process.argv.push("107");
			for(var j=2; j<process.argv.length; j++ ) {
				if ( object[i].StationID == (process.argv[j]||"107") ) {
					//console.log(JSON.stringify(object[i]));
					console.log("Estacion: " + format(object[i].StationName));
					if ( parseInt(object[i].StationAvailableBikes) == 0 ) {
						console.log("UNA PENA! NO HAY BICICLETAS DISPONIBLES! :(");
					} else {
						console.log("Enhorabuena! tienes " + object[i].StationAvailableBikes + " BICICLETAS DISPONIBLES :)");
					}
					console.log("----");
				}
			}
		} 
	});
});

function format(string) {
	return string.replace('&Agrave;','Á');
}

req.on('error', function(e) {
	console.log('problem with the request: ' + e.message);
});

req.end();

