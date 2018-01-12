var carObject = require('../models/carObject.js');
var generateCars = require('./generateCars.js');

var numberOfCars = 5;
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

function DumbCarMovement(){
    for (var i = 0; i < carArray.length; i++) {
        if (carArray[i]._xPos < carArray[i].xDestination){
            carArray[i]._xPos= carArray[i]._xPos + 0.05;
        }
        else if(carArray[i]._xPos > carArray[i].xDestination){
            carArray[i]._xPos= carArray[i]._xPos - 0.05;
        }
        else if(carArray[i]._yPos < carArray[i].yDestination){
            carArray[i]._yPos = carArray[i]._yPos + 0.05;
        }
        else if(carArray[i]._yPos > carArray[i].yDestination){
            carArray[i]._yPos = carArray[i]._yPos - 0.05;
        }
    }
    setCarArr(carArray);
}

module.exports = {createDumbCars, getCarArr, setCarArr, DumbCarMovement};
