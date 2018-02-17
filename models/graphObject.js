var edgeObject = require('./edgeObject.js');
var edgeWeightObject = require('./edgeWeightObject.js');

var edgeArray = new Array();
var edgeWeightArray = new Array();
var edgeWeightMap = {};

function readEdgeFile() {
  var fs = require('fs');
  var file = "./map/SiouxFalls_net.tntp";
  var lines = fs.readFileSync(file).toString();
  var line = lines.split("\n");
  var edgeId = 0;
  // console.log(line);
  for (var i = 0; i < line.length; i++) {
    // console.log(line[i]);
    if (!line[i].startsWith("<") && !line[i].startsWith("~")) {
      var word = line[i].split("\t");
      // console.log(word);
      if (word[1] != undefined) {
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

        // // Create an edge weight object
        var newNode = {
          [endNodeId]: length
        };
        if (edgeWeightMap[startNodeId] != undefined) {
          var id = Object.keys(edgeWeightMap[startNodeId]);
          // console.log(len);
          for (var j = 0; j < id.length; j++) {
            var idLength = edgeWeightMap[startNodeId][id[j]];
            newNode[id[j]] = idLength;
          }
          // console.log(newNode);
        }
        edgeWeightMap[startNodeId] = newNode;

        edgeId++;
      }
    }
  }
}

// console.log(edgeArray[0]);
module.exports = class graphObject {
  constructor() {
    readEdgeFile();
  }

  getStartNode(edgeId) {
    return edgeArray[edgeId - 1].getStartNode();
  }
  getEndNode(edgeId) {
    return edgeArray[edgeId - 1].getEndNode();
  }
  getEdgeArray() {
    return edgeArray;
  }
  getEdgeWeightMap() {
    return edgeWeightMap;
  }
  getNumOfEdges() {
    return edgeArray.length;
  }
  getEdgeObject(edgeId) {
    return edgeArray[edgeId - 1];
  }
  insertCarToEdge(carId, edgeId, colNum) {
    edgeArray[edgeId - 1].addCarToEdge(carId, colNum);
    // console.log(edgeArray[edgeId-1]);
  }
  removeCarFromEdge(carId, edgeId, colNum) {
    edgeArray[edgeId - 1].removeCarFromEdge(carId, colNum);
    // console.log(edgeArray[edgeId-1]);
  }
  getCarsOnEdge(edgeId) {
    // console.log(edgeId);
    return edgeArray[edgeId - 1]._listOfCars;
  }
}