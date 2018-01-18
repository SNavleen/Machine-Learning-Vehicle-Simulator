var express = require('express');
var cfenv = require('cfenv');
var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

var dcMovement = require('./views/dcMovement.js')
var carCreation = require('./views/carCreation.js')
carCreation.createDumbCars();
var carArray = carCreation.getCarArr();

io.on('connection', function(client){
	// Emit initial car positions
    client.emit('DumbCarArray', carCreation.getCarArr());
    console.log("Initial Dumb Car Array Sent");
    
    // Variables for tracking if all cars have reached destination
    var movementFinished = false;
    var carsFinished = 0;

    // Loop for moving cars
    //while (movementFinished != true) {
    var dcMovementLoop = setInterval(function() { // Temporarily using interval to display cars moving slowly
    	// This loop checks each car in carArray and moves it closer towards its destination
	    for (var i = 0; i < carArray.length; i++) {
			if (carArray[i]._xPos < carArray[i].xDestination){
			    carArray[i]._xPos= carArray[i]._xPos + 1;
			}
			else if(carArray[i]._xPos > carArray[i].xDestination){
			    carArray[i]._xPos= carArray[i]._xPos - 1;
			}
			else if(carArray[i]._yPos < carArray[i].yDestination){
			    carArray[i]._yPos = carArray[i]._yPos + 1;
			}
			else if(carArray[i]._yPos > carArray[i].yDestination){
			    carArray[i]._yPos = carArray[i]._yPos - 1;
			}

			// Checking whether all cars have reached destination
			if (carArray[i]._xPos == carArray[i].xDestination && carArray[i]._yPos == carArray[i].yDestination) {
				carsFinished++;
				if (carsFinished == carArray.length) {
					movementFinished = true;
					clearInterval(dcMovementLoop); // Stops the interval from trying to send
				}
			}
		}

		// Updates the carArray with new positions and sends data to client
		carCreation.setCarArr(carArray);
		client.emit('DumbCarArray', carCreation.getCarArr());
		console.log("Dumb Car Array Sent");
	}, 800); // How often the server updates the client

    //client.emit('RunCar', dcMovement.DumbCarMovement());
    //console.log("Temp2");
    client.on('disconnect',function(){});
});

app.use(express.static(__dirname + '/public'));
var appEnv = cfenv.getAppEnv();
server.listen(appEnv.port, '0.0.0.0', function() {
    console.log("server starting on " + appEnv.url);
});
