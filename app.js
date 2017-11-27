var express = require('express');
var cfenv = require('cfenv');
var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var carObject = require('./models/carObject.js')

io.on('connection', function(client){
    client.emit('event', generateDumbCar());
    client.on('disconnect',function(){});
});

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


app.use(express.static(__dirname + '/public'));

var appEnv = cfenv.getAppEnv();

server.listen(appEnv.port, '0.0.0.0', function() {
    console.log("server starting on " + appEnv.url);
});
