var edgeObject = require('./edgeObject.js');
var edgeWeightObject = require('./edgeWeightObject.js');

var edgeArray = new Array();
var edgeWeightArray = new Array();

function readEdgeFile(){
	var fs = require('fs');
	var file = "./map/SiouxFalls_net.tntp";
	var lines = fs.readFileSync(file).toString();
  var line = lines.split("\n");
	var edgeId = 0;
	// console.log(line);
	for(var i = 0; i < line.length; i++){
		// console.log(line[i]);
		if(!line[i].startsWith("<") && !line[i].startsWith("~")){
			var word = line[i].split("\t");
			// console.log(word);
			if(word[1] != undefined){
				// edgeId, startNodeId, endNodeId, capacity, length, freeFlowTime, b, power, speedLimit, toll, type
				var startNodeId = word[1];
				var endNodeId = word[2];
				var capacity = word[3];
				var length = word[4];
				var freeFlowTime = word[5];
				var b = word[6];
				var power = word[7];
				var speedLimit = word[8];
				var toll = word[9];
				var type = word[10];

				// Create an edge object
				var edge = new edgeObject(edgeId, startNodeId, endNodeId, capacity, length, freeFlowTime, b, power, speedLimit, toll, type);
				// console.log(edge);
				// Add the edge to array
				edgeArray.push(edge);

				// Create an edge weight object
				var edgeWeight = new edgeWeightObject(endNodeId, length);
				// console.log(edgeWeight);
				// Add the edge to array
				// console.log(edgeWeightArray.length);
				while(edgeWeightArray.length-1 != startNodeId){
					edgeWeightArray.push(new Array());
				}
				edgeWeightArray[startNodeId].push(edgeWeight);

				edgeId ++;
			}
		}
	}
	// console.log(edgeWeightArray);
}

// console.log(edgeArray[0]);
module.exports = class graphObject{
  constructor(){
		readEdgeFile();
  }

	getStartNode(edgeId){
		return edgeArray[edgeId].getStartNode();
	}
	getEndNode(edgeId){
		return edgeArray[edgeId].getEndNode();
	}
	getEdgeArray(){
		return edgeArray;
	}
	getEdgeWeightArray(){
		return edgeWeightArray;
	}
	getNumOfEdges(){
		return edgeArray.length;
	}
	getEdgeObject(edgeId){
		return edgeArray[edgeId];
	}
	insertCarToEdge(carId, edgeId, colNum){
		edgeArray[edgeId-1].addCarToEdge(carId, colNum);
		// console.log(edgeArray[edgeId-1]);
	}
	removeCarFromEdge(carId, edgeId, colNum){
		edgeArray[edgeId-1].removeCarFromEdge(carId, colNum);
		// console.log(edgeArray[edgeId-1]);
	}
	getCarsOnEdge(edgeId){
		return edgeArray[edgeId-1]._listOfCars;
	}
}
