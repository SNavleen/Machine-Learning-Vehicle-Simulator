var carObject = require('../models/carObject.js');
var generateCars = require('./generateCars.js');

var numberOfCars = 1;
var carArray = new Array(numberOfCars);


function createDumbCars(){
  //initializes all the car
  for (var i = 0; i < numberOfCars; i++) {
      carArray[i] = new carObject;
      carArray[i] = generateCars.generateDumbCar();
  }
}

function getCarArr(){
  return carArray;
}
function setCarArr(cars){
  carArray = cars;
}
module.exports = {createDumbCars, getCarArr, setCarArr};
