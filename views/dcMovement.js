var carCreation = require('./carCreation.js')

carCreation.createDumbCars();
var carArray = carCreation.getCarArr();

// TODO See if io can be assigned to a var to move everything out of the export function
// TODO Clean up code and remove everything out of socket function (only keep socket events)

// Calculates the absolute difference between two numbers
var difference = function (a, b) {
    return Math.abs(a - b); 
}

// A function used to round a float number to a specific precision
function precisionRound(number, precision) {
    var factor = Math.pow(10, precision);
    return Math.round(number * factor) / factor;
}

// TODO Fix this comment
// The minimumSlowDownDistance function is an addition factorial that returns the addition factorial value of a given number
var minimumSlowDownDistance = function (currentSpeed) {
    var totalStoppingDistance = 0;
    currentSpeed = precisionRound(currentSpeed, 2);
    
    while(currentSpeed > 0) {
        totalStoppingDistance = precisionRound(currentSpeed + totalStoppingDistance, 2);  
        currentSpeed = precisionRound(currentSpeed - 0.01, 2);
    }
    return totalStoppingDistance;
}

// This functions allows io from app.js to be used
module.exports = function(io) {
    io.on('connection', function(dcSocket) {
        // Emit initial car positions
        dcSocket.emit('DumbCarArray', carCreation.getFrontendCarArr());

        //var carFinished = true;
        //var speedflag = false; // TODO Figure this out

        // Loop for moving all dumb cars on an interval
        var dcMovementLoop = setInterval(function() { // Temporarily using interval to display cars moving carDeceleratingly
            // This loop checks each car in carArray and moves it closer towards its destination
            for (var i = 0; i < carArray.length; i++) {
                var xpos = precisionRound(carArray[i]._xPos,3);
                var ypos = precisionRound(carArray[i]._yPos,3);
                var xdes = precisionRound(carArray[i].xDestination,3);
                var ydes = precisionRound(carArray[i].yDestination,3);
                var speed = precisionRound(carArray[i]._speed,3);

                // determines if a car has reached its destination or not
                //carFinished = true; // TODO Figure this out

                var carDecelerating = false;

                // checks if the car needs to move along the xaxis
                if (difference(xpos,xdes) > 0.0001) {
                    // Determines if the car is reaching it's x destination
                    if (difference(xpos,xdes) <= minimumSlowDownDistance(speed)) {
                        carArray[i]._speed = precisionRound(speed - 0.01, 3);
                        carDecelerating = true;
                    }
                    // Checks if the car is moving left or right
                    if (xpos > xdes) {
                        carArray[i]._orientation = 180;
                        carArray[i]._xPos = precisionRound(xpos - speed, 3);
                    }
                    else {
                        carArray[i]._orientation = 0;
                        carArray[i]._xPos = precisionRound(xpos + speed, 3);
                    }
                    carFinished = false;
                }
                else if (difference(ypos,ydes) > 0.0001) {
                    // Determines if the car is reaching it's y destination
                    if (difference(ypos,ydes) <= minimumSlowDownDistance(speed)) {
                        carArray[i]._speed = precisionRound(speed - 0.01, 3);
                        carDecelerating = true;
                    }
                    // If the car is heading north
                    if (ypos > ydes) {
                        // Conditional for when the car is starting north but hasn't yet fully turned
                        //carArray[i]._yPos = precisionRound(ypos - speed, 3);
                        if (carArray[i]._orientation != 90) {
                            //speedflag = true;
                            carArray[i]._speed = 0.001; // Turning speed
                            //speed = 0.001111111111;

                            // Checks if the car needs to turn left heading north
                            if (carArray[i]._orientation >= 0 && carArray[i]._orientation < 90) {
                                carArray[i]._orientation = carArray[i]._orientation + 10;
                            }
                            // Check if car needs to turn right heading north
                            else if (carArray[i]._orientation > 90 && carArray[i]._orientation <= 180) {
                                carArray[i]._orientation = carArray[i]._orientation - 10;
                            }
                        }
                        /*
                        // Temp removal, ask Paul (Used different approach to only speed up after turning)
                        else if (speedflag == true) {
                            carArray[i]._speed = 0.01;
                            speed = 0.01;
                            carArray[i]._orientation = 90;
                            speedflag = false;
                        }*/

                        // Car Ready to accelerate
                        else {
                            carArray[i]._speed = precisionRound(speed + 0.01, 3); // TODO Will continue to accelerate
                        }

                        carArray[i]._yPos = precisionRound(ypos - carArray[i]._speed, 3);
                    }
                    // If the car is heading south
                    else {
                        if (carArray[i]._orientation != 270) {
                            carArray[i]._speed = 0.001;

                            // Allows for right turns heading south by setting orientation from 0 to 360
                            if (carArray[i]._orientation == 0) {
                                carArray[i]._orientation = 360;
                            }
                            // Check if car needs to turn left heading south
                            if (carArray[i]._orientation >= 180 && carArray[i]._orientation < 270) {
                                carArray[i]._orientation = carArray[i]._orientation + 10;
                            }
                            // Check if car needs to turn right heading south
                            else if (carArray[i]._orientation > 270 && carArray[i]._orientation <= 360) {
                                carArray[i]._orientation = carArray[i]._orientation - 10;
                            }
                        }
                        // Car Ready to accelerate
                        else {
                            carArray[i]._speed = precisionRound(speed + 0.01, 3); // TODO Will continue to accelerate
                        }

                        carArray[i]._yPos = precisionRound(ypos + carArray[i]._speed, 3);
                    }
                    carFinished = false;
                }

                
                // Temp removal, ask Paul (no need to decelerate on y ATM, will need to change in future)
                if (carArray[i]._speed < 0.05 && carDecelerating == false) {
                    carArray[i]._speed = precisionRound(speed + 0.01, 3);
                }
            }

            /*if (carFinished == true) {
                console.log("SPLICE NOW");
                //carArray.splice(i,1);
            }*/

            // Updates the carArray with new positions and sends data to client
            carCreation.setCarArr(carArray);

            dcSocket.emit('DumbCarArray', carCreation.getFrontendCarArr());
        }, 100); // How often the server updates the client
    });
};

// Trevor's debugging statements
// console.log("x",carArray[i]._xPos,"y",carArray[i]._yPos,"speed:",carArray[i]._speed);
// console.log("xdes",carArray[i].xDestination,"ydes",carArray[i].yDestination,"speed:",carArray[i]._speed);
