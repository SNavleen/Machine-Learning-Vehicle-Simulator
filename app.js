var express = require('express');
var cfenv = require('cfenv');
var io = require('socket.io')(app);
var app = express();

io.on('connection', function(client){
	client.on('event',function(data){});
	client.on('disconnect',function(){});
});

app.use(express.static(__dirname + '/public'));

var appEnv = cfenv.getAppEnv();

app.listen(appEnv.port, '0.0.0.0', function() {
  console.log("server starting on " + appEnv.url);
});
