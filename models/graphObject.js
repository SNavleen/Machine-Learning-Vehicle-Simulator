var edgeObject = require('./edgeObject.js');
var edgeArray = new Array();
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
			// 	// edgeId, startNodeId, endNodeId, capacity, length, freeFlowTime, b, power, speedLimit, toll, type
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
				var edge = new edgeObject(edgeId, startNodeId, endNodeId, capacity, length, freeFlowTime, b, power, speedLimit, toll, type);
				// console.log(edge);
				edgeArray.push(edge);
				// console.log(edgeArray[0]);
				edgeId ++;
			}
		}
	}
}

// console.log(edgeArray[0]);
module.exports = class graphObject{
  constructor(){
		readEdgeFile();
  }

	insertCarToEdge(carId, edgeId, colNum){
		edgeArray[edgeId-1].addCarToEdge(carId, colNum);
		console.log(edgeArray[edgeId-1]);
	}
	removeCarFromEdge(carId, edgeId, colNum){
		edgeArray[edgeId-1].removeCarFromEdge(carId, colNum);
		console.log(edgeArray[edgeId-1]);
	}
	getCarsOnEdge(edgeId){
		return edgeArray[edgeId-1]._listOfCars;
	}
}
