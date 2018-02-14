var carObject = require('../models/carObject.js');
var map = require('../views/mapCreate.js'); // TODO This is a second require of map, we may need to move it?

var numberOfCars = 1;
var currentCarID = 0;
var carArray = new Array(numberOfCars);
var frontendCarArray = new Array(numberOfCars);


function createDumbCars(){
  //initializes dumb cars
  for (var i = 0; i < numberOfCars; i++) {
      carArray[i] = new carObject;
      carArray[i] = generateDumbCar();
  }
}

function generateDumbCar(){
  var carType = "Dumb";
  var start = randomizeCarPosStart();
  var end = randomizeCarPosEnd();
  var route = map.dijkstrasGraph.shortestPath('1', '24').concat(['1']).reverse();
  let car = new carObject(currentCarID, start.x, start.y, end.x, end.y, carType, route);
  currentCarID++; // This will need to be removed from dumbcar and applied to all vehicle spawns
  car._currentEdgeID = start.EdgeID;
  console.log("Orientatoin ",map.getEdgeObject(start.EdgeID).orientation);
  car._orientation = map.getEdgeObject(start.EdgeID).orientation;
  car._xPos = start.x;
  car._yPos = start.y;

  // Initalizes cars starting orientation (since atm it's either going left or right it automatically sets this here)
  // This might need to change eventually because it's a bit of a work around (ask Paul for further explanation)
  if (start.x > end.x) { car._orientation = 180; }
  else { car._orientation = 0; }

  return car;
}
// TODO This randomization will have to be adjusted once djkistras in implemented
function randomizeCarPosStart() {
  // Temp removal, doesn't work at the moment (ask Paul)
  // TODO This gets called twice
  // TODO Must insert cars to edge
  //get StartX
  //get EdgeArray
  var edgeArrayLen = map.getNumOfEdges();
  var EdgeID = (Math.floor(Math.random()*edgeArrayLen));
  EdgeID = 29;

 // console.log(map.getEdgeObject(EdgeID));
  if(map.getEdgeObject(EdgeID).orientation == 90 || map.getEdgeObject(EdgeID).orientation == -90 || map.getEdgeObject(EdgeID).orientation == 270 || map.getEdgeObject(EdgeID).orientation == -270){
    console.log("end node y",map.getEndNode(EdgeID).y, "start node y", map.getStartNode(EdgeID).y);
    var y = Math.floor(Math.random() * map.getEndNode(EdgeID).y + map.getStartNode(EdgeID).y); 
    var x = map.getStartNode(EdgeID).x;
    console.log("Car start",x,y);
    return {x: x, y :y, EdgeID: EdgeID};
  }
  if(map.getEdgeObject(EdgeID).orientation == 0 ||  map.getEdgeObject(EdgeID).orientation == 180 || map.getEdgeObject(EdgeID).orientation == -180){
    var x = Math.floor(Math.random() * map.getEndNode(EdgeID).x + map.getStartNode(EdgeID).x); 
    var y = map.getStartNode(EdgeID).y;
    console.log("Car start",x,y);
    return {x: x, y :y, EdgeID: EdgeID};

  }

  var A = [map.getStartNode(EdgeID).x,map.getStartNode(EdgeID).y];
  var B = [map.getEndNode(EdgeID).x,map.getEndNode(EdgeID).y];
  var m = slope(A, B);
  var b = intercept(A, m);
  console.log("point 1",A[0],A[1]);
  console.log("point 2",B[0],B[1]);
  console.log("slope",m);
  console.log("intercept",b);
  var coordinates = [];
  console.log("RANGE:",A[0],B[0]);
  var x = parseInt(A[0]);
  var n = parseInt(B[0]);
  for (x;x<n;x+=5000) {

   var y = (m * x) + b;
    console.log(x);
   // console.log(y);

   // console.log(x,y);
    coordinates.push([x, y]);

  }
  console.log(coordinates);
  var spawn = coordinates[Math.floor(Math.random()*coordinates.length)];
  console.log("SPAWN",spawn[0],spawn[1]);

  // var x = Math.floor(Math.random() * 6);
  // var y = Math.floor(Math.random() * 6);

  return {x: spawn[0], y: spawn[1], EdgeID: EdgeID};
  

  // var x = Math.floor(Math.random() * 6);
  // var y = Math.floor(Math.random() * 6);
  // return {x: x, y: y};
}
// TODO This randomization will have to be adjusted once djkistras in implemented
function randomizeCarPosEnd() {
  // Temp removal, doesn't work at the moment (ask Paul)
  // TODO This gets called twice
  // TODO Must insert cars to edge
  //get StartX
  //get EdgeArray
  var edgeArrayLen = map.getNumOfEdges();
  var EdgeID = (Math.floor(Math.random()*edgeArrayLen));
  //EdgeID = 28;

 // console.log(map.getEdgeObject(EdgeID));
  if(map.getEdgeObject(EdgeID).orientation == 90 || map.getEdgeObject(EdgeID).orientation == -90 || map.getEdgeObject(EdgeID).orientation == 270 || map.getEdgeObject(EdgeID).orientation == -270){
    console.log("end node y",map.getEndNode(EdgeID).y, "start node y", map.getStartNode(EdgeID).y);
    var y = Math.floor(Math.random() * map.getEndNode(EdgeID).y + map.getStartNode(EdgeID).y); 
    var x = map.getStartNode(EdgeID).x;
    console.log("Car start",x,y);
    return {x: x, y :y};
  }
  else if(map.getEdgeObject(EdgeID).orientation == 0 ||  map.getEdgeObject(EdgeID).orientation == 180 || map.getEdgeObject(EdgeID).orientation == -180){
    var x = Math.floor(Math.random() * map.getEndNode(EdgeID).x + map.getStartNode(EdgeID).x); 
    var y = map.getStartNode(EdgeID).y;
    console.log("Car start",x,y);
    return {x: x, y :y};

  }

  var A = [map.getStartNode(EdgeID).x,map.getStartNode(EdgeID).y];
  var B = [map.getEndNode(EdgeID).x,map.getEndNode(EdgeID).y];
  var m = slope(A, B);
  var b = intercept(A, m);
  console.log("point 1",A[0],A[1]);
  console.log("point 2",B[0],B[1]);
  console.log("slope",m);
  console.log("intercept",b);
  var coordinates = [];
  console.log("RANGE:",A[0],B[0]);
  var x = parseInt(A[0]);
  var n = parseInt(B[0]);
  for (x;x<n;x+=5000) {

   var y = (m * x) + b;
    console.log(x);
   // console.log(y);

   // console.log(x,y);
    coordinates.push([x, y]);

  }
    console.log(coordinates);
  var spawn = coordinates[Math.floor(Math.random()*coordinates.length)];


  // var x = Math.floor(Math.random() * 6);
  // var y = Math.floor(Math.random() * 6);

  return {x: spawn[0], y: spawn[1]};
  

  // var x = Math.floor(Math.random() * 6);
  // var y = Math.floor(Math.random() * 6);
  // return {x: x, y: y};
}

function getFrontendCarArr(){
  for (var i = 0; i < numberOfCars; i++) {
     // console.log("Car Array [i] xpos",carArray[i]._xPos);
     // console.log("Car Array [i] ypos",carArray[i]._yPos);

      frontendCarArray[i] = {_xPos: carArray[i]._xPos, _yPos: carArray[i]._yPos, _orientation: carArray[i]._orientation}
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

function slope(a, b) {
    if (a[0] == b[0]) {
        return null;
    }

    return (b[1] - a[1]) / (b[0] - a[0]);
}
function intercept(point, slope) {
    if (slope === null) {
        // vertical line
        return point[0];
    }
      // y(point1) - slope * xpoint1
    return point[1] - slope * point[0];
}




function getCarArr(){
  return carArray;
}

function setCarArr(cars){
  carArray = cars;
}

module.exports = {createDumbCars, getCarArr, setCarArr, getFrontendCarArr, getCar};
