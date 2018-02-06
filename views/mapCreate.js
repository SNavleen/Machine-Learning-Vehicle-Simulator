var graphObject = require('../models/graphObject.js')
var map = new graphObject();

var dijkstras = require('../views/dijkstras.js')
var dijkstrasGraph = new dijkstras.Graph();

// Dijkstra's
var edgeWeightMap = map.getEdgeWeightMap();
for(var i = 1; i <= Object.keys(edgeWeightMap).length; i++){
	dijkstrasGraph.addVertex(i, edgeWeightMap[i]);
}

function getCarsOnEdge(edgeId) {
	return map.getCarsOnEdge(edgeId);
}

function getNumOfEdges() {
	return map.getNumOfEdges();
}

function getEdgeObject(edgeId) {
	return map.getEdgeObject(edgeId);
}

function getEdgeArray() {
	return map.getEdgeArray();
}

function removeCarFromEdge(carId, edgeId, colNum) {
	return map.removeCarFromEdge(carId, edgeId, colNum);
}

function insertCarToEdge(carId, edgeId, colNum) {
	return map.insertCarToEdge(carId, edgeId, colNum);
}


//console.log(dijkstrasGraph.shortestPath('1', '24').concat(['1']).reverse());

module.exports = {dijkstrasGraph, getCarsOnEdge, getNumOfEdges, getEdgeObject, getEdgeArray, removeCarFromEdge, insertCarToEdge};

// HOW to use map object

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
