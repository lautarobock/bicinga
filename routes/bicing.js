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
            msg += chunk;
        });
        iRes.on('end', function() {
            var object = eval("("+msg+")");
            var stations = [];
            if ( req.query.stations && req.query.stations instanceof Array ) {
                stations = req.query.stations;
            } else if ( req.query.stations ) {
                stations.push(req.query.stations);
            }
            var response = [];
            for(var i=0; i<object.length; i++ ) {
                if ( stations.length == 0 || contains(stations,object[i].StationID) ) {
                    response.push({
                        StationID:object[i].StationID,
                        StationName: format(object[i].StationName),
                        DisctrictCode: object[i].DisctrictCode,
                        AddressGmapsLatitude:object[i].AddressGmapsLatitude,
                        AddressGmapsLongitude:object[i].AddressGmapsLongitude,
                        StationAvailableBikes:object[i].StationAvailableBikes,
                        StationFreeSlot:object[i].StationFreeSlot,
                        AddressZipCode:object[i].AddressZipCode,
                        AddressStreet1:object[i].AddressStreet1,
                        AddressNumber:object[i].AddressNumber,
                        NearbyStationList:object[i].NearbyStationList,
                        StationStatusCode:object[i].StationStatusCode
                    });
                }
            }
            res.send(response);
        });
    });

    function contains(stations,StationID) {
        for(var j=0; j<stations.length; j++ ) {
            if ( StationID == stations[j] ) {
                return true;
            }
        }
        return false;
    }

    function format(string) {
        return string.replace('&Agrave;','Á');
    }

    iReq.on('error', function(e) {
        console.log('problem with the request: ' + e.message);
    });

    iReq.end();
}
