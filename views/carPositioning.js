var general = require('../views/general.js');
var map = require('../views/mapCreate.js'); // TODO This is a second require of map, we may need to move it?
var carCreation = require('./carCreation.js');//TODO This is a second require of carCreation, we may need to move it?

// Returns the edgeId of the passed in cars next edge on it's current route
function getNextEdgeInRoute(carId) {
  var edgeArray = map.getEdgeArray();
  var currentCar = carCreation.getCar(carId);
  var currentEdgeEnd = map.getEdgeObject(currentCar._currentEdgeId).endNodeId;
  var nextEdgeStart = currentEdgeEnd;

  // Finds the ID of the next node in the route
  if (nextEdgeStart != currentCar.route[currentCar.route.length - 1]) {
    var nextEdgeEnd = currentCar.route[currentCar.route.indexOf(nextEdgeStart) + 1];

    // Scan through all edges to find the next one on the route
    for (var i = 1; i < edgeArray.length; i++) {
      // Switch to this edge
      if (edgeArray[i].startNodeId == nextEdgeStart && edgeArray[i].endNodeId == nextEdgeEnd) {
        return edgeArray[i].edgeId;
      }
    }
  }
}

function checkIfLaneChangeIsNeeded(currentLane, currentEdgeId, nextEdgeId) {
  var startNode = map.getStartNode(currentEdgeId);
  var endNode = map.getEndNode(currentEdgeId)
  var currentEdge = map.getEdgeObject(currentEdgeId);
  var nextEdge = map.getEdgeObject(nextEdgeId);
  var nextTurn;
  if (nextEdge) {
    var currentEdgeOrientation = currentEdge._orientation;
    var nextEdgeOrientation = nextEdge._orientation;

    if (currentEdgeOrientation != nextEdgeOrientation) {
      if (currentEdgeOrientation == 0) {
        if (nextEdgeOrientation == 90) {
          console.log("left turn");
          nextTurn = 1;
        } else {
          console.log("right turn");
          nextTurn = 2;
        }
      } else if (currentEdgeOrientation == 90) {
        if (nextEdgeOrientation == 180) {
          console.log("left turn");
          nextTurn = 1;
        } else {
          console.log("right turn");
          nextTurn = 2;
        }
      } else if (currentEdgeOrientation == 180) {
        if (nextEdgeOrientation == 270) {
          console.log("left turn");
          nextTurn = 1;
        } else {
          console.log("right turn");
          nextTurn = 2;
        }
      } else if (currentEdgeOrientation == 270) {
        if (nextEdgeOrientation == 0) {
          console.log("left turn");
          nextTurn = 1;
        } else {
          console.log("right turn");
          nextTurn = 2;
        }
      }
      if (nextTurn == currentLane) {
        return -1;
      } else {
        return nextTurn;
      }
    }
  }
  return -1;
}

module.exports = {
  getNextEdgeInRoute,
  checkIfLaneChangeIsNeeded
};
