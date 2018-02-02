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

var dcMovement = require('./views/dcMovement.js')(io);

// HOW to use map object
// var graphObject = require('./models/graphObject.js');

// var map = new graphObject();
// map.insertCarToEdge(1,2,0);
// map.insertCarToEdge(2,2,0);
// map.insertCarToEdge(3,2,0);
//
// map.removeCarFromEdge(2,2,0);
// console.log(map.getCarsOnEdge(2));
// var startNode = map.getStartNode(0);
// var endNode = map.getEndNode(0);
// var arr = map.getEdgeArray();
// var numEdges = map.getNumOfEdges();
// var edgeObj = map.getEdgeObject(0);
// console.log(startNode);
// console.log(endNode);
// console.log(arr);
// console.log(numEdges);
// console.log(edgeObj);
