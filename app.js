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
var createMap = require('./views/frontEndMapCreation.js')(io);
