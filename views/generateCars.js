module.exports = {generateDumbCar};

var carObject = require('../models/carObject.js');

function generateDumbCar(){
  var carColour = getRandomColor();
  var carType = "Dumb";
  var start = randomizeCarPos();
  var end = randomizeCarPos();
  let car = new carObject(start.x, start.y, end.x, end.y, carColour, carType);
 // let car = new carObject(5, 5, 3, 5, carColour, carType);

  car._xPos = start.x;
  car._yPos = start.y;
  //console.log("Create car");
  
  return car;
}

function randomizeCarPos(){
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
    console.log("Car positions", x , y);
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
