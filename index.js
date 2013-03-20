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
	res.setEncoding('utf-8');
	res.on('data', function(chunk) {
		//console.log(chunk);
		msg += chunk;
	});
	res.on('end', function() {
		console.log(msg);
	});
});

req.on('error', function(e) {
	console.log('problem with the request: ' + e.message);
});

req.end();

