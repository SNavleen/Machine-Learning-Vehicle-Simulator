var express = require('express');
var cfenv = require('cfenv');
var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

app.use(express.static(__dirname + '/public'));
var appEnv = cfenv.getAppEnv();
server.listen(appEnv.port, '0.0.0.0', function() {
    console.log("server starting on " + appEnv.url);
});

// TODO Create map object like below and pass to any functions like io in dcMovement
var dcMovement = require('./views/dcMovement.js')(io);
//var graphObject = require('./models/graphObject.js');


// HOW to use map object
// var map = new graphObject();
// map.insertCarToEdge(1,2,0);
// map.insertCarToEdge(2,2,0);
// map.insertCarToEdge(3,2,0);
//
// map.removeCarFromEdge(2,2,0);
// console.log(map.getCarsOnEdge(2));
