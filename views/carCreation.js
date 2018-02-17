var carObject = require('../models/carObject.js');
var general = require('../views/general.js');
var map = require('../views/mapCreate.js'); // TODO This is a second require of map, we may need to move it?

var numberOfCars = 1;
var currentCarId = 0;
var carArray = new Array(numberOfCars);
var frontendCarArray = new Array(numberOfCars);


function createDumbCars() {
  //initializes dumb cars
  for (var i = 0; i < numberOfCars; i++) {
    carArray[i] = new carObject;
    carArray[i] = generateDumbCar();
  }
}

function generateDumbCar() {
  var edgeArrayLen = map.getNumOfEdges();
  // var edgeIdStart = general.randInterval(1, edgeArrayLen);
  var edgeIdStart = 51;
  var edgeIdEnd = general.randInterval(1, edgeArrayLen);
  // var edgeIdEnd = 30;
  var edgeObj = map.getEdgeObject(edgeIdStart);
  // console.log("edgeArrayLen: ", edgeArrayLen);
  // console.log("edgeIdStart: ", edgeIdStart);
  // console.log("edgeIdEnd: ", edgeIdEnd);
  var carType = "Dumb";
  var start = randomizeCarPos(edgeIdStart);
  var end = randomizeCarPos(edgeIdEnd);
  var route = map.dijkstrasGraph.shortestPath('1', '24').concat(['1']).reverse();
  let car = new carObject(currentCarId, start.x, start.y, end.x, end.y, carType, route);
  car._xPos = start.x;
  car._yPos = start.y;
  car._orientation = map.getEdgeObject(edgeIdStart).orientation;
  car._currentEdgeId = edgeIdStart;
  map.insertCarToEdge(currentCarId, edgeIdStart, 0);

  // Initalizes cars starting orientation (since atm it's either going left or right it automatically sets this here)
  // This might need to change eventually because it's a bit of a work around (ask Paul for further explanation)
  // if (start.x > end.x) {
  //   car._orientation = 180;
  // } else {
  //   car._orientation = 0;
  // }

  // console.log("edgeObj: ", edgeObj);
  console.log("carObject: ", car);
  currentCarId++; // This will need to be removed from dumbcar and applied to all vehicle spawns
  return car;
}

function randomizeCarPos(edgeId) {
  // Get the (x, y) of the startNode
  var edgeStartNode = map.getStartNode(edgeId);
  // Get the (x, y) of the endNode
  var edgeEndNode = map.getEndNode(edgeId)
  // console.log("StartNode x: ", edgeStartNode.x, " y:", edgeStartNode.y);
  // console.log("EndNode x: ", edgeEndNode.x, " y:", edgeEndNode.y);

  // Get the min and max of the x start and end node
  var xMin = general.min(edgeStartNode.x, edgeEndNode.x);
  var xMax = general.max(edgeStartNode.x, edgeEndNode.x);
  // console.log("RandX min: ", xMin, " max: ", xMax);

  // Get the min and max of the y start and end node
  var yMin = general.min(edgeStartNode.y, edgeEndNode.y);
  var yMax = general.max(edgeStartNode.y, edgeEndNode.y);
  // console.log("RandY min: ", yMin, " max: ", yMax);

  var randX = general.randInterval(xMin, xMax);
  var randY;

  // Set all the values in the formula y = m * x + b
  var slope = general.slope(edgeStartNode, edgeEndNode);
  // console.log("Slope: ", slope);
  var intercept = general.intercept(edgeStartNode, slope);
  // console.log("Intercept: ", intercept);

  if (slope == undefined) {
    randY = general.randInterval(yMin, yMax);
    // console.log("randX: ", randX, " randY: ", randY);
    return {
      x: randX,
      y: randY
    };
  }

  randY = Math.floor((slope * randX) + intercept);
  // console.log("randX: ", randX, " randY: ", randY);

  return {
    x: randX,
    y: randY
  };
}

function getFrontendCarArr() {
  for (var i = 0; i < numberOfCars; i++) {
    // console.log("Car Array [i] xpos",carArray[i]._xPos);
    // console.log("Car Array [i] ypos",carArray[i]._yPos);

    frontendCarArray[i] = {
      _xPos: carArray[i]._xPos,
      _yPos: carArray[i]._yPos,
      _orientation: carArray[i]._orientation
    }
  }
  return frontendCarArray;
}

function getCar(carId) {
  for (var i = 0; i < carArray.length; i++) {
    if (carArray[i].carId == carId) {
      return carArray[i];
    }
  }
  return "Error in carCreation.js";
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
  getCar
};