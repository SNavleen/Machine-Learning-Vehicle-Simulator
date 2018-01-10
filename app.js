var express = require('express');
var cfenv = require('cfenv');
var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

var carDisplay = require('./views/generateCars.js')
var carDisplay = require('./views/carCreation.js')


io.on('connection', function(client){
    client.emit('DumbCarDisplay', carDisplay.main());
    client.on('disconnect',function(){});
});

app.use(express.static(__dirname + '/public'));
var appEnv = cfenv.getAppEnv();
server.listen(appEnv.port, '0.0.0.0', function() {
    console.log("server starting on " + appEnv.url);
});
