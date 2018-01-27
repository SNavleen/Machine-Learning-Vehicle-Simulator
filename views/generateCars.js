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

  // Initalizes cars starting orientation (since atm it's either going left or right it automatically sets this here)
  // This might need to change eventually because it's a bit of a work around (ask Paul for further explanation)
  if (start.x > end.x) { car._orientation = 180; }
  else { car._orientation = 0; }

  return car;
}

function randomizeCarPos(){
  var x = Math.floor(Math.random() * 6);
  var y = Math.floor(Math.random() * 6);
  
    if(Math.floor(Math.random() * 2)== 0){
      var x = Math.floor(Math.random() * 6);
      if(Math.floor(Math.random() * 2)== 0){
        var y =0;
      }
      else{
        var y = 5;
      }
  }
    else{
      var y = Math.floor(Math.random() * 6);
      if(Math.floor(Math.random() * 2)== 0){
        var x =0;
      }
      else{
        var x = 5;
      }
    }
  
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
