var express = require('express');
var cfenv = require('cfenv');
var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

var dcMovement = require('./views/dcMovement.js')
var carCreation = require('./views/carCreation.js')
carCreation.createDumbCars();

io.on('connection', function(client){
    client.emit('DumbCarArray', carCreation.getCarArr());
    client.emit('RunCar', dcMovement.DumbCarMovement());
    client.on('disconnect',function(){});
});



app.use(express.static(__dirname + '/public'));
var appEnv = cfenv.getAppEnv();
server.listen(appEnv.port, '0.0.0.0', function() {
    console.log("server starting on " + appEnv.url);
});
