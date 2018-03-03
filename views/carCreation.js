var carObject = require('../models/carObject.js');
var general = require('../views/general.js');
var map = require('../views/mapCreate.js'); // TODO This is a second require of map, we may need to move it?

var numberOfCars = 1;
var currentCarId = 0; // TODO See if we should change this to start at 1 (there shouldn't be a car 0)
var carArray = new Array(numberOfCars);
var frontendCarArray = new Array(numberOfCars);

// Used to generate a working (shortest path) route for each car
function setupRoute() {
  var edgeArray = map.getEdgeArray();
  var edgeArrayLen = map.getNumOfEdges();

  // Initalize edge ID's to be ==
  var route;
  var edgeIdStart;
  var edgeIdEnd; // Note: This might not always be the edge it ends on (it might only have the end node of the edge the car actually does end on)

  // Check to ensure DJK is not run on a single edge + is not passed same start and end node
  while (edgeIdStart == edgeIdEnd) {
    edgeIdStart = general.randInterval(1, edgeArrayLen); // TODO Handle these magic numbers - Nav
    edgeIdEnd = general.randInterval(1, edgeArrayLen);
    if (edgeIdStart != edgeIdEnd) {
      var edgeObjStart = map.getEdgeObject(edgeIdStart);
      var edgeObjEnd = map.getEdgeObject(edgeIdEnd);

      // Nodes for start/end of route
      var startEdgeStartNodeId = edgeObjStart.getStartNode().nodeId;
      var startEdgeEndNodeId = edgeObjStart.getEndNode().nodeId;
      var endEdgeStartNodeId = edgeObjEnd.getStartNode().nodeId;
      var endEdgeEndNodeId = edgeObjEnd.getEndNode().nodeId;
      // Second check to see if the two edges selected share a common intersection (would cause problems with DJK - Paul)
      if (startEdgeStartNodeId == endEdgeStartNodeId ||
        startEdgeStartNodeId == endEdgeEndNodeId ||
        startEdgeEndNodeId == endEdgeStartNodeId ||
        startEdgeEndNodeId == endEdgeEndNodeId) {
        edgeIdStart = edgeIdEnd; // Sets while condition to true to re-run the loop and regenerate values
      }

      route = map.dijkstrasGraph.shortestPath(startEdgeStartNodeId, endEdgeEndNodeId).concat([startEdgeStartNodeId]).reverse();

      // Temporary fix to set minimum route length to 3
      // With a route length of 2 there's potential for cars to move in the wrong direction
      // TODO Hard coded bug fix for to stop route from ending on node 2 (see github issue)
      if ((edgeIdStart != edgeIdEnd && route.length < 3) || route[route.length - 1] == '2') {
        edgeIdStart = edgeIdEnd; // Sets while condition to true to re-run the loop and regenerate values
      }
      // Generations successful, reset values to be on the route to prevent errors (ask Paul for clarification)
      else if (edgeIdStart != edgeIdEnd && route.length >= 3) {
        // Scan through all edges
        for (var i = 1; i < edgeArray.length; i++) {
          // Finds the first edge on the route
          if (edgeArray[i].startNodeId == route[0] && edgeArray[i].endNodeId == route[1]) {
            edgeIdStart = edgeArray[i].edgeId;
            // Not being used ATM, add back in if needed (TODO Make sure this isn't modifying the map object itself)
            // edgeObjStart.getStartNode().nodeId = edgeArray[i].startNodeId;
            // edgeObjStart.getEndNode().nodeId = edgeArray[i].endNodeId;
          }

          // Finds the last edge on the route
          if (edgeArray[i].startNodeId == route[route.length - 2] && edgeArray[i].endNodeId == route[route.length - 1]) {
            edgeIdEnd = edgeArray[i].edgeId;
            // Not being used ATM, add back in if needed (TODO Make sure this isn't modifying the map object itself)
            // edgeObjEnd.getStartNode().nodeId = edgeArray[i].startNodeId;
            // edgeObjEnd.getEndNode().nodeId = edgeArray[i].endNodeId;
          }
        }
      }
    }
  }
  return {
    edgeIdStart: edgeIdStart,
    edgeIdEnd: edgeIdEnd,
    route: route
  };
}

function createDumbCars() {
  //initializes dumb cars
  for (var i = 0; i < numberOfCars; i++) {
    carArray[i] = new carObject;
    carArray[i] = generateDumbCar();
  }
}

function generateDumbCar() {
  var route = setupRoute();

  var carType = "Dumb";
  var start = randomizeCarPos(route.edgeIdStart);
  var end = randomizeCarPos(route.edgeIdEnd);
  let car = new carObject(currentCarId, start.x, start.y, end.x, end.y, carType, route.route);
  car._xPos = start.x;
  car._yPos = start.y;
  car._orientation = map.getEdgeObject(route.edgeIdStart).orientation;
  car._currentEdgeId = route.edgeIdStart;
  //TODO: currently setting the default lane that the car spawns on as far left
  car._currentLane = 1;
  map.insertCarToEdge(currentCarId, route.edgeIdStart, car._currentLane);

  currentCarId++; // This will need to be removed from dumbcar and applied to all vehicle spawns
  return car;
}

function randomizeCarPos(edgeId) {
  // Get the (x, y) of the startNode
  var edgeStartNode = map.getStartNode(edgeId);
  // Get the (x, y) of the endNode
  var edgeEndNode = map.getEndNode(edgeId);

  // Get the min and max of the x start and end node
  var xMin = general.min(edgeStartNode.x, edgeEndNode.x);
  var xMax = general.max(edgeStartNode.x, edgeEndNode.x);
  // console.log("RandX min: ", xMin, " max: ", xMax);

  // Get the min and max of the y start and end node
  var yMin = general.min(edgeStartNode.y, edgeEndNode.y);
  var yMax = general.max(edgeStartNode.y, edgeEndNode.y);

  var randX = (xMin + xMax) / 2; // Temp removal by Paul to spawn in middle of edge // general.randInterval(xMin, xMax);
  var randY;

  // Set all the values in the formula y = m * x + b
  var slope = general.slope(edgeStartNode, edgeEndNode);
  var intercept = general.intercept(edgeStartNode, slope);

  if (slope == undefined) {
    randY = (yMin + yMax) / 2; // Temp removal by Paul to spawn in middle of edge // general.randInterval(yMin, yMax);

    return {
      x: randX,
      y: randY
    };
  }


  randY = (yMin + yMax) / 2; // Temp removal by Paul to spawn in middle of edge // Math.floor((slope * randX) + intercept);

  return {
    x: randX,
    y: randY
  };
}

function getFrontendCarArr() {
  for (var i = 0; i < carArray.length; i++) {
    frontendCarArray[i] = {
      _xPos: carArray[i]._xPos,
      _yPos: carArray[i]._yPos,
      _orientation: carArray[i]._orientation
    }
  }
  return frontendCarArray;
}

function spliceFrontendCarArr(index) {
  frontendCarArray.splice(index, 1);
}

function getCar(carId) {
  for (var i = 0; i < carArray.length; i++) {
    if (carArray[i].carId == carId) {
      return carArray[i];
    }
  }
  return "Error in carCreation.js"; // TODO deal with this instead of returning a string
}

function getCarArr() {
  return carArray;
}

function setCarArr(cars) {
  carArray = cars;
}

module.exports = {
  createDumbCars,
  getCarArr,
  setCarArr,
  getFrontendCarArr,
  spliceFrontendCarArr,
  getCar
};