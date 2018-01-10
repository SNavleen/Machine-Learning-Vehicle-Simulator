var carObject = require('../models/carObject.js')
var generateCars = require('./views/generateCars.js')

function main(){
  var numberOfCars = 1;
  var carArray = new Array(numberOfCars);

  //initializes all the car
  for (var i = 0; i < numberOfCars; i++) {
      carArray[i] = new carObject;
      carArray[i] = generateDumbCar();
  //     carArray[i]._xPos = carArray[i].xStart *100;
  //     carArray[i]._yPos = carArray[i].yStart *100;
  }
  return carArray;
}
