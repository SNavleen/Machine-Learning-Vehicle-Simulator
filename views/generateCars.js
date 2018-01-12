module.exports = {generateDumbCar};

var carObject = require('../models/carObject.js');

function generateDumbCar(){
  var carColour = getRandomColor();
  var carType = "Dumb";
  var start = randomizeCarPos();
  var end = randomizeCarPos();
  let car = new carObject(start.x, start.y, end.x, end.y, carColour, carType);
  car._xPos = start.x;
  car._yPos = start.y;

  return car;
}

function randomizeCarPos(){
    var x = Math.floor(Math.random() * 6);
    var y = Math.floor(Math.random() * 6);

    return {x: x, y: y};
}

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var colour = '#';
    for (var i = 0; i < 6; i++ ) {
        colour += letters[Math.floor(Math.random() * 16)];
    }
    return colour;
}
