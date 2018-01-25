var carCreation = require('./carCreation.js')

carCreation.createDumbCars();
var carArray = carCreation.getCarArr();

// TODO See if io can be assigned to a var to move everything out of the export function
// TODO Clean up code and remove everything out of socket function (only keep socket events)

// This functions allows io from app.js to be used
module.exports = function(io) {
    io.on('connection', function(dcSocket) {
        // Emit initial car position
        dcSocket.emit('DumbCarArray', carCreation.getFrontendCarArr());

        // Variables for tracking if all cars have reached destination
        var movementFinished = false;
        var carsFinished = 0;

        // Loop for moving cars
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

function precisionRound(number, precision) {
  var factor = Math.pow(10, precision);
  return Math.round(number * factor) / factor;
}
