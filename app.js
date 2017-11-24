var express = require('express');
var cfenv = require('cfenv');
var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

io.on('connection', function(client){
    client.on('event',function(data){
        console.log('Client sent info: ', data.message);
    });

    client.emit('event',randomizeCarPosition());

    client.on('disconnect',function(){});
});

function randomizeCarPosition(){
    var colour = getRandomColor();
    var car = {xStart:0,yStart:0,xDestination:0,yDestination:0,xPosition:0,yPosition:0,carColour:colour};
    var x = Math.floor(Math.random() * 6);
    var y = Math.floor(Math.random() * 6);

    car.xDestination = x;
    car.yDestination = y;

    var x1 = Math.floor(Math.random() * 6);
    var y1 = Math.floor(Math.random() * 6);

    car.xStart = x1;
    car.yStart = y1;

    car.xPosition= 100*x1;
    car.yPosition= 100*y1;

    return car;
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
