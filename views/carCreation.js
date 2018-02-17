var carObject = require('../models/carObject.js');
var general = require('../views/general.js');
var map = require('../views/mapCreate.js'); // TODO This is a second require of map, we may need to move it?

var numberOfCars = 1;
var currentCarID = 0;
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
  var edgeIdStart = 63;
  // var edgeIdEnd = general.randInterval(1, edgeArrayLen);
  var edgeIdEnd = 61;
  var edgeObj = map.getEdgeObject(edgeIdStart);
  // console.log("edgeObj: ", edgeObj);
  // console.log("edgeArrayLen: ", edgeArrayLen);
  // console.log("edgeIdStart: ", edgeIdStart);
  // console.log("edgeIdEnd: ", edgeIdEnd);
  var carType = "Dumb";
  var start = randomizeCarPos(edgeIdStart);
  var end = randomizeCarPos(edgeIdEnd);
  var route = map.dijkstrasGraph.shortestPath('1', '24').concat(['1']).reverse();
  let car = new carObject(currentCarID, start.x, start.y, end.x, end.y, carType, route);
  currentCarID++; // This will need to be removed from dumbcar and applied to all vehicle spawns
  // car._currentedgeId = start.edgeId;
  car._orientation = map.getEdgeObject(edgeIdStart).orientation;
  car._xPos = start.x;
  car._yPos = start.y;

  // Initalizes cars starting orientation (since atm it's either going left or right it automatically sets this here)
  // This might need to change eventually because it's a bit of a work around (ask Paul for further explanation)
  // if (start.x > end.x) {
  //   car._orientation = 180;
  // } else {
  //   car._orientation = 0;
  // }

  console.log("carObject: ", car);
  return car;
}
// TODO This randomization will have to be adjusted once djkistras in implemented
function randomizeCarPos(edgeId) {
  // Temp removal, doesn't work at the moment (ask Paul)
  // TODO This gets called twice
  // TODO Must insert cars to edge
  // Get the (x, y) of the startNode
  var edgeStartNode = map.getStartNode(edgeId);
  // Get the (x, y) of the endNode
  var edgeEndNode = map.getEndNode(edgeId)
  console.log("StartNode x: ", edgeStartNode.x, " y:", edgeStartNode.y);
  console.log("EndNode x: ", edgeEndNode.x, " y:", edgeEndNode.y);

  // Set all the values in the formula y = m * x + b
  var slope = general.slope(edgeStartNode, edgeEndNode);
  console.log("Slope: ", slope);
  var intercept = general.intercept(edgeStartNode, slope);
  console.log("Intercept: ", intercept);

  // Get the min and max of the x start and end node
  var xMin = general.min(edgeStartNode.x, edgeEndNode.x);
  var xMax = general.max(edgeStartNode.x, edgeEndNode.x);
  // console.log("RandX min: ", xMin, " max: ", xMax);

  // Get the min and max of the y start and end node
  var yMin = general.min(edgeStartNode.y, edgeEndNode.y);
  var yMax = general.max(edgeStartNode.y, edgeEndNode.y);
  // console.log("RandY min: ", yMin, " max: ", yMax);

  var randX = general.randInterval(xMin, xMax);
  var randY = general.randInterval(yMin, yMax);
  // console.log("Car Start Pos x: ", randX, " y: ", randY);

  var coordinates = [];
  console.log("RANGE:", edgeStartNode.x, edgeEndNode.y);
  var x = parseInt(edgeStartNode.x);
  var n = parseInt(edgeEndNode.y);
  // console.log("x: ", x, " n: ", n);
  for (x; x < n; x += 5000) {

    var y = (slope * x) + intercept;
    // console.log(x);
    // console.log(y);

    // console.log(x,y);
    coordinates.push([x, y]);

  }
  // console.log(coordinates);
  var spawn = coordinates[Math.floor(Math.random() * coordinates.length)];
  console.log("SPAWN", spawn[0], spawn[1]);

  // var x = Math.floor(Math.random() * 6);
  // var y = Math.floor(Math.random() * 6);
  //
  // return {
  //   x: spawn[0],
  //   y: spawn[1],
  //   edgeId: edgeId
  // };


  // var x = Math.floor(Math.random() * 6);
  // var y = Math.floor(Math.random() * 6);
  // return {x: x, y: y};
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

function getCar(carID) {
  for (var i = 0; i < carArray.length; i++) {
    if (carArray[i].carID == carID) {
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