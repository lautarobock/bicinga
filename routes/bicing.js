/**
 * Created with JetBrains WebStorm.
 * User: lautaro
 * Date: 21/03/13
 * Time: 8:24
 * To change this template use File | Settings | File Templates.
 */

var http = require('http');

module.exports.findAll = function(req,res,next) {
    var opt = {
        hostname: 'www.bicing.cat',
        port: 80,
        path: '/localizaciones/getJsonObject.php',
        method: 'GET'
    };

    var msg = "";

    var iReq = http.request(opt, function(iRes) {
        iRes.setEncoding('utf8');
        iRes.on('data', function(chunk) {
//            console.log(chunk);
            msg += chunk;
        });
        iRes.on('end', function() {
            //console.log(msg);
//            res.send(msg);
            var object = eval("("+msg+")");
            var stations = [];
            if ( req.query.stations && req.query.stations instanceof Array ) {
                stations = req.query.stations;
            } else if ( req.query.stations ) {
                stations.push(req.query.stations);
            }
            var response = [];
            for(var i=0; i<object.length; i++ ) {
                for(var j=0; j<stations.length; j++ ) {
                    if ( object[i].StationID == stations[j] ) {
//                        res.send(object[i]);
                        response.push(object[i]);
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
            res.send(response);
        });
    });

    function format(string) {
        return string.replace('&Agrave;','Á');
    }

    iReq.on('error', function(e) {
        console.log('problem with the request: ' + e.message);
    });

    iReq.end();
}