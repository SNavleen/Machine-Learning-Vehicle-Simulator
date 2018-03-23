var general = require('../views/general.js');
var map = require('../views/mapCreate.js'); // TODO This is a second require of map, we may need to move it?
var carCreation = require('./carCreation.js');//TODO This is a second require of carCreation, we may need to move it?

//TODO number line if possible
//function checks if the next edge in route and determins if its a left or right turn next and checks if its in the right lane to do that turn
function checkIfLaneChangeIsNeeded(currentLane, currentEdgeId, nextEdgeId) {
  var startNode = map.getStartNode(currentEdgeId);
  var endNode = map.getEndNode(currentEdgeId)
  var currentEdge = map.getEdgeObject(currentEdgeId);
  var nextEdge = map.getEdgeObject(nextEdgeId);
  var nextTurn; //when next turn is a 1 it means a right turn and 2 means a left turn
  if (nextEdge) {
    var currentEdgeOrientation = currentEdge._orientation;
    var nextEdgeOrientation = nextEdge._orientation;

    if (currentEdgeOrientation != nextEdgeOrientation) { //if the next orientation is the same then we dont need to change lane
      if (currentEdgeOrientation == 0) { //for each current orientation check for left and right turns, becasue of our previous checks makes sure that each current orientation only has 2 possible turns
        if (nextEdgeOrientation == 90) { //if next edge is 90 then it next turn is a 1
          console.log("left turn");
          nextTurn = 1;
        } else { //everything else meaning just 270 degrees is a right turn so 2
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
      if (nextTurn == currentLane) { //if the next turn and currentlane is the same that means it doesnt need a lane change
        return -1;
      } else { //it will return the next turn meaning what lane lane it should change to as well
        return nextTurn;
      }
    }
  }
  return -1;
}

module.exports = {
  checkIfLaneChangeIsNeeded
};
