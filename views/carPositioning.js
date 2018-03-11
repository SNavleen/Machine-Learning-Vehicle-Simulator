var general = require('../views/general.js');
var map = require('../views/mapCreate.js'); // TODO This is a second require of map, we may need to move it?
var carCreation = require('./carCreation.js');//TODO This is a second require of carCreation, we may need to move it?

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
  checkIfLaneChangeIsNeeded
};
