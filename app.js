var express = require('express');
var cfenv = require('cfenv');
var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

// var generateCars = import('./views/generateCars.js')
// var carCreation = import('./views/carCreation.js')


io.on('connection', function(client){
    // client.emit('DumbCarDisplay', generateCars.main());
    client.on('disconnect',function(){});
});

app.use(express.static(__dirname + '/public'));
var appEnv = cfenv.getAppEnv();
server.listen(appEnv.port, '0.0.0.0', function() {
    console.log("server starting on " + appEnv.url);
});
