
/**
 * Module dependencies.
 */

var express = require('express')
//  , routes = require('./routes')
  , http = require('http')
  , path = require('path');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('lac713'));
  app.use(express.session());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
//  app.use(express.cookieSession());

});

app.configure('development', function(){
  app.use(express.errorHandler());
  app.use(express.logger('dev'));     /* 'default', 'short', 'tiny', 'dev' */
  app.use(express.bodyParser());
});


////Session verification interceptor
//app.all('/*.html', function(req,res,next){
//    var s = req.session;
//    if (s.user || req.url == "/index.html" ) {
//        next();
//    } else if ( !s.user && req.query["user"] == "lautaro" ) {
//        s.user = "jose";
//        next();
//    } else {
//        res.redirect("/index.html");
//    }
//});

////REST servces configuration
////var rest = require("./util/rest.js");
//var services = ["user","account","currency","movement","category"];
//for ( var i in services) {
//    var service = services[i];
//    var serviceModule = require("./routes/"+service+".js");
////    rest.buildExpress(app,service);
//    app.get('/' + service , serviceModule.findAll);
//    app.get('/'+ service +'/:id', serviceModule.findById);
//    app.post('/' + service , serviceModule.add);
//    app.put('/'+ service +'/:id', serviceModule.update);
//    app.delete('/'+ service +'/:id', serviceModule.delete);
//}

//Resume Services
var resume = require("./routes/bicing.js");
app.get('/bicing',resume.findAll);
//app.get('/station',resume.stationAll);
//app.get('/station/:id',resume.stationById);



http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
