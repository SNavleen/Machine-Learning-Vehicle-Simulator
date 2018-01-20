var carObject = require('../models/carObject.js');
var generateCars = require('./generateCars.js');

var numberOfCars = 3;
var carArray = new Array(numberOfCars);
var frontendCarArray = new Array(numberOfCars);


function createDumbCars(){
  //initializes all the car
  for (var i = 0; i < numberOfCars; i++) {
      carArray[i] = new carObject;
      carArray[i] = generateCars.generateDumbCar();
  }
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
