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

var dik = require('./views/dijkstras.js');

var graphObject = require('./models/graphObject.js');

var object = new graphObject();

var test = object.getEdgeWeightArray()

var map = {};
for (var i = 1; i < test.length; i++){
	var id1 = test[i][0].nodeId;
	var id1Length = test[i][0].weight;
	var id2 = test[i][1].nodeId;
	var id2Length = test[i][1].weight;
	map[i] = {[id1]:id1Length,[id2]:id2Length};
}
console.log(map);

var graph = new dik.Graph(map);

var test = graph.findShortestPath('10', '11');

console.log(test);


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