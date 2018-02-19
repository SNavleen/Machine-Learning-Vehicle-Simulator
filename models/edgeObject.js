var nodeObject = require('./nodeObject.js');
var nodeArray = new Array();
function readNodeFile(){
	var fs = require('fs');
	var file = "./map/SiouxFalls_node.tntp";
	var lines = fs.readFileSync(file).toString();
  var line = lines.split("\n");
	for(var i = 0; i < line.length; i++){
		var word = line[i].split("\t");
		// console.log(word);
		var nodeId = word[0];
		var x = word[1];
		var y = word[2];
		if(word[0] != "Node" && word[0] != ''){
			var node = new nodeObject(nodeId, x, y);
			// console.log(node);
			nodeArray.push(node);
		}
	}
	// return nodeArray;
}
// Set the orientation of the edge
function orientationOfEdge(node1, node2){
	var deltaX = nodeArray[node2].x - nodeArray[node1].x;
	var deltaY = nodeArray[node2].y - nodeArray[node1].y;
	var rad = Math.atan2(deltaY, deltaX);

	var deg = rad * (180 / Math.PI);

	// Flips degrees if negative
	if(deg < 0) {
		deg = 360 + deg;
    }

	return deg;
}


module.exports = class edgeObject{
  constructor(edgeId, startNodeId, endNodeId, capacity, length, freeFlowTime, b, power, speedLimit, toll, type){
		this.edgeId = edgeId;
		this.startNodeId = startNodeId;
		this.endNodeId = endNodeId;
		this.capacity = capacity;
		this.length = length;
		this.freeFlowTime = freeFlowTime;
		this.b = b;
		this.power = power;
		this.speedLimit = speedLimit;
		this.toll = toll;
		this.type = type;
		if(nodeArray.length < 1){
			readNodeFile();
		}

		this._orientation = orientationOfEdge(this.startNodeId - 1, this.endNodeId - 1);
		this._listOfCars = new Array();

  }

	get orientation(){
		return this._orientation;
	}
	get listOfCars(){
		return this._listOfCars;
	}
	getNumOfNodes(){
		return nodeArray.length;
	}
	getStartNode(){
		return nodeArray[this.startNodeId-1];
	}
	getEndNode(){
		return nodeArray[this.endNodeId-1];
	}
	addCarToEdge(carId, colNum){
		this._listOfCars.push(carId);
	}
	removeCarFromEdge(carId, colNum){
		var index = this._listOfCars.indexOf(carId);
		if (index > -1) {
	    this._listOfCars.splice(index, 1);
		}
	}
}
