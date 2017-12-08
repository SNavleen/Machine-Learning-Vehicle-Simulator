var express = require('express');
var cfenv = require('cfenv');
var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var carObject = require('./models/carObject.js')

var numberOfCars = 1;
var carArray = new Array(numberOfCars);

for (var i = 0; i < numberOfCars; i++) {//initializes all the car objects
    carArray[i] = new carObject;
    carArray[i] = generateDumbCar();
    carArray[i]._xPos = carArray[i].xStart *100;
    carArray[i]._yPos = carArray[i].yStart *100;
}

function generateDumbCar(){
  var carColour = getRandomColor();
  var carType = "Dumb";
  var start = randomizeCarPos();
  var end = randomizeCarPos();
  let car = new carObject(start.x, start.y, end.x, end.y, carColour, carType);

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

io.on('connection', function(client){

    client.emit('DumbCarMovement',DumbCarMovement());

    client.on('disconnect',function(){});
});


function DumbCarMovement(){
    for (var i = 0; i < numberOfCars; i++) {
        if (carArray[i].xStart <carArray[i].xDestination){
            carArray[i]._xPos= carArray[i]._xPos + 5;
            carArray[i].xStart = carArray[i]._xPos/100;
        }
        else if(carArray[i].xStart >carArray[i].xDestination){
            carArray[i]._xPos= carArray[i]._xPos - 5;
            carArray[i].xStart = carArray[i]._xPos/100;
        }
        else if(carArray[i].yStart < carArray[i].yDestination){
            carArray[i]._yPos = carArray[i]._yPos + 5;
            carArray[i].yStart = carArray[i]._yPos/100;
        }
        else if(carArray[i].yStart > carArray[i].yDestination){
            carArray[i]._yPos = carArray[i]._yPos - 5;
            carArray[i].yStart = carArray[i]._yPos/100;
        }
    }
    return carArray[0];
}


app.use(express.static(__dirname + '/public'));

var appEnv = cfenv.getAppEnv();

server.listen(appEnv.port, '0.0.0.0', function() {
    console.log("server starting on " + appEnv.url);
});
