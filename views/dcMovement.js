var carCreation = require('./carCreation.js')

carCreation.createDumbCars();
var carArray = carCreation.getCarArr();

// define constructor function that gets `io` send to it
module.exports = function(io) {
    io.on('connection', function(dcSocket) {
        // Emit initial car position
        dcSocket.emit('DumbCarArray', carCreation.getFrontendCarArr());

        // Variables for tracking if all cars have reached destination
        var movementFinished = false;
        var carsFinished = 0;

        // Loop for moving cars
        //while (movementFinished != true) {
        var dcMovementLoop = setInterval(function() { // Temporarily using interval to display cars moving slowly
            // This loop checks each car in carArray and moves it closer towards its destination
            for (var i = 0; i < carArray.length; i++) {
                if (carArray[i]._xPos < carArray[i].xDestination){
                    carArray[i]._xPos = precisionRound(carArray[i]._xPos + 0.05, 2);
                    carArray[i]._orientation = 0;
                }
                else if(carArray[i]._xPos > carArray[i].xDestination){
                    carArray[i]._xPos = precisionRound(carArray[i]._xPos - 0.05, 2);
                    carArray[i]._orientation = 180;
                }
                else if(carArray[i]._yPos < carArray[i].yDestination){
                    carArray[i]._yPos = precisionRound(carArray[i]._yPos + 0.05, 2);
                    carArray[i]._orientation = 270;
                }
                else if(carArray[i]._yPos > carArray[i].yDestination){
                    carArray[i]._yPos = precisionRound(carArray[i]._yPos - 0.05, 2);
                    carArray[i]._orientation = 90;
                }
            }

            // Updates the carArray with new positions and sends data to client
            carCreation.setCarArr(carArray);
            dcSocket.emit('DumbCarArray', carCreation.getFrontendCarArr());
        }, 30); // How often the server updates the client
    });
};

// Old movement code from app.js, to be removed once trevors branch is merged
/*
    // Emit initial car positions
    client.emit('DumbCarArray', carCreation.getFrontendCarArr());
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
                carArray[i]._xPos = precisionRound(carArray[i]._xPos + 0.05, 2);
                carArray[i]._orientation = 0;
            }
            else if(carArray[i]._xPos > carArray[i].xDestination){
                carArray[i]._xPos = precisionRound(carArray[i]._xPos - 0.05, 2);
                carArray[i]._orientation = 180;
            }
            else if(carArray[i]._yPos < carArray[i].yDestination){
                carArray[i]._yPos = precisionRound(carArray[i]._yPos + 0.05, 2);
                carArray[i]._orientation = 270;
            }
            else if(carArray[i]._yPos > carArray[i].yDestination){
                carArray[i]._yPos = precisionRound(carArray[i]._yPos - 0.05, 2);
                carArray[i]._orientation = 90;
            }

            // Checking whether all cars have reached destination
            // if (carArray[i]._xPos == carArray[i].xDestination && carArray[i]._yPos == carArray[i].yDestination) {
            //  carsFinished++;
            //  if (carsFinished == carArray.length) {
            //      movementFinished = true;
            //      clearInterval(dcMovementLoop); // Stops the interval from trying to send
            //  }
            // }
        }

        // Updates the carArray with new positions and sends data to client
        carCreation.setCarArr(carArray);
        client.emit('DumbCarArray', carCreation.getFrontendCarArr());
        // console.log("Dumb Car Array Sent");
    }, 50); // How often the server updates the client

    //client.emit('RunCar', dcMovement.DumbCarMovement());
    //console.log("Temp2");
    client.on('disconnect',function(){});
*/

function precisionRound(number, precision) {
  var factor = Math.pow(10, precision);
  return Math.round(number * factor) / factor;
}
