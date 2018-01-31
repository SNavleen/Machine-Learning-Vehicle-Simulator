var carObject = require('../models/carObject.js');
//var generateCars = require('./generateCars.js');

var numberOfCars = 10;
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
  var start = randomizeCarPos();
  var end = randomizeCarPos();
  let car = new carObject(currentCarID, start.x, start.y, end.x, end.y, carType);
  currentCarID++; // This will need to be removed from dumbcar and applied to all vehicle spawns
  car._xPos = start.x;
  car._yPos = start.y;

  // Initalizes cars starting orientation (since atm it's either going left or right it automatically sets this here)
  // This might need to change eventually because it's a bit of a work around (ask Paul for further explanation)
  if (start.x > end.x) { car._orientation = 180; }
  else { car._orientation = 0; }

  return car;
}

// TODO This randomization will have to be adjusted once djkistras in implemented
function randomizeCarPos() {
  var x = Math.floor(Math.random() * 6);
  var y = Math.floor(Math.random() * 6);

  return {x: x, y: y};
}

function getFrontendCarArr(){
  for (var i = 0; i < numberOfCars; i++) {
      frontendCarArray[i] = {_xPos: carArray[i]._xPos, _yPos: carArray[i]._yPos, _orientation: carArray[i]._orientation}
  }
  return frontendCarArray;
}

function getCarArr(){
  return carArray;
}

function setCarArr(cars){
  carArray = cars;
}

module.exports = {createDumbCars, getCarArr, setCarArr, getFrontendCarArr};
