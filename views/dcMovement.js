var graphObject = require('../models/graphObject.js');
var carCreation = require('./carCreation.js')

carCreation.createDumbCars();
var carArray = carCreation.getCarArr();

var map = new graphObject(); // TODO this will have to be removed later

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

// Returns an additonal factorial of a given number (used to determine the stopping distance of the car)
var minimumSlowDownDistance = function (currentSpeed) {
    var totalStoppingDistance = 0;
    currentSpeed = precisionRound(currentSpeed, 2);
    
    while(currentSpeed > 0) {
        totalStoppingDistance = precisionRound(currentSpeed + totalStoppingDistance, 2);  
        currentSpeed = precisionRound(currentSpeed - 0.01, 2);
    }
    return totalStoppingDistance;
}

// Function for returning cars to current roads speed limit
// TODO Need to add in road specific speed (instead of 0.05), may need a new function for this (Paul needs to ask Nav)
function accelerate(carID) {
    if (carCreation.getCar(carID)._speed < 0.05) {
        carCreation.getCar(carID)._speed = carCreation.getCar(carID)._speed + 0.01;
    }
    else {
        carCreation.getCar(carID)._speed = 0.05;
    }
    return false;
}

// Determines the distance between two cars
function euclideanDistance(currentCarX, currentCarY, checkedCarX, checkedCarY) {
    var xDifference = difference(currentCarX, checkedCarX);
    var yDifference = difference(currentCarY, checkedCarY);
    var distance = Math.sqrt(xDifference * xDifference + yDifference * yDifference);
    return distance;
}

// Checks the distance of the nearest vehicle on a cars current road
function collisionAvoidanceCheck(carID, edgeID) {
    var currentCar = carCreation.getCar(carID);
    var carsOnEdge = getCarsOnEdge(edgeID);

    var currentCarX = currentCar._xPos;
    var currentCarY = currentCar._yPos;
    var checkedCarX = 0;
    var checkedCarY = 0;

    var shortestDistance = Number.MAX_SAFE_INTEGER; // resets the distance to max

    // Check against each car currently on edge
    for (var i = 0; i < carsOnEdge.length; i++) {
        // Makes sure not to check itself
        if (currentCar._carID != carsOnEdge[i]._carID) {
            checkedCarX = carsOnEdge[i]._xPos;
            checkedCarY = carsOnEdge[i]._yPos;

            // Only need to check cars with a larger x
            if (currentCar._orientation == 0) {
                if (currentCarX < checkedCarX) {
                    currentDistance = euclideanDistance(currentCarX, currentCarY, checkedCarX, checkedCarY);
                }
            }
            // Only need to check cars with a smaller x
            else if (currentCar._orientation == 180) {
                if (currentCarX > checkedCarX) {
                    currentDistance = euclideanDistance(currentCarX, currentCarY, checkedCarX, checkedCarY);
                }
            }
            // Only need to check cars with a smaller y
            else if (currentCar._orientation > 0 && currentCar._orientation < 180) {
                if (currentCarY > checkedCarY) {
                    currentDistance = euclideanDistance(currentCarX, currentCarY, checkedCarX, checkedCarY);
                }
            }
            // Only need to check cars with a larger y
            else if (currentCar._orientation > 180) {
                if (currentCarY < checkedCarY) {
                    currentDistance = euclideanDistance(currentCarX, currentCarY, checkedCarX, checkedCarY);
                }
            }

            // Determines the shortest distance in the edge relative to the current car
            if (currentDistance < shortestDistance) {
                shortestDistance = currentDistance;
            }
        }
    }
    return shortestDistance;
}

// This functions allows io from app.js to be used
module.exports = function(io) {
    io.on('connection', function(dcSocket) {
        // Emit initial car positions
        dcSocket.emit('DumbCarArray', carCreation.getFrontendCarArr());

        var carFinished = true; // Used to determine when a car has reached it's destination

        // Loop for moving all dumb cars on an interval
        var dcMovementLoop = setInterval(function() { // Temporarily using interval to display cars moving slowly
            // This loop checks each car in carArray and moves it closer towards its destination
            for (var i = 0; i < carArray.length; i++) {
                var xpos = precisionRound(carArray[i]._xPos,3);
                var ypos = precisionRound(carArray[i]._yPos,3);
                var xdes = precisionRound(carArray[i].xDestination,3);
                var ydes = precisionRound(carArray[i].yDestination,3);
                var speed = precisionRound(carArray[i]._speed,3);

                carFinished = true; // determines if a car has reached its destination or not

                var carDecelerating = false; // TODO Remove if not needed

                // Collision avoidance
                // Checks the distance of the next car on the road and triggers decleration if needed
                // Get current edge
                // Get current cars on current edge
                // Compare all cars in that list
                // Determine if car is infront mathematically based on orientation vs edge orientation
                // You know which X and Y direction the car is facing scan for cars withing **100ish or something ** units ONLY IN THE CURRENT EDGE ARRAY
                // Create function (math) for checking distance to next car based of current X Y vs other X Y
                // Note: Currently roads go both ways but are only set up as one array in the backend (Nav needs to split this up into both directions so we only compare against cars on current road and current side)

                // checks if the car needs to move along the xaxis
                if (difference(xpos,xdes) > 0.0001) {
                    /*
                    // Determines if the car is reaching it's x destination
                    if (difference(xpos,xdes) <= minimumSlowDownDistance(speed)) {
                        carArray[i]._speed = precisionRound(speed - 0.01, 3);
                        carDecelerating = true;
                    }*/
                    // Checks if the car needs to move left or right
                    if (xpos > xdes) {
                        accelerate(carArray[i]._carID);
                        carArray[i]._xPos = precisionRound(xpos - speed, 3);
                    }
                    else if (xpos < xdes) {
                        accelerate(carArray[i]._carID);
                        carArray[i]._xPos = precisionRound(xpos + speed, 3);
                    }
                    carFinished = false;
                }
                else if (difference(ypos,ydes) > 0.0001) {
                    /*
                    // Determines if the car is reaching it's y destination
                    if (difference(ypos,ydes) <= minimumSlowDownDistance(speed)) {
                        carArray[i]._speed = precisionRound(speed - 0.01, 3);
                        carDecelerating = true;
                    }*/
                    // If the car is heading north
                    if (ypos > ydes) {
                        // Conditional for when the car is starting north but hasn't yet fully turned
                        if (carArray[i]._orientation != 90) {
                            // TODO Temporarily just sets speed to 0
                            carArray[i]._speed = 0; // Turning speed

                            // Checks if the car needs to turn left heading north
                            if (carArray[i]._orientation >= 0 && carArray[i]._orientation < 90) {
                                carArray[i]._orientation = carArray[i]._orientation + 5;
                            }
                            // Check if car needs to turn right heading north
                            else if (carArray[i]._orientation > 90 && carArray[i]._orientation <= 180) {
                                carArray[i]._orientation = carArray[i]._orientation - 5;
                            }
                        }

                        // Car Ready to accelerate
                        else {
                            accelerate(carArray[i]._carID);
                        }

                        carArray[i]._yPos = precisionRound(ypos - carArray[i]._speed, 5);
                    }
                    // If the car is heading south
                    else {
                        if (carArray[i]._orientation != 270) {
                            carArray[i]._speed = 0; // Turning speed

                            // Allows for right turns heading south by setting orientation from 0 to 360
                            if (carArray[i]._orientation == 0) {
                                carArray[i]._orientation = 360;
                            }
                            // TODO Will need to change orientation base on next roads orientation
                            // Check if car needs to turn left heading south
                            if (carArray[i]._orientation >= 180 && carArray[i]._orientation < 270) {
                                carArray[i]._orientation = carArray[i]._orientation + 5;
                            }
                            // Check if car needs to turn right heading south
                            else if (carArray[i]._orientation > 270 && carArray[i]._orientation <= 360) {
                                carArray[i]._orientation = carArray[i]._orientation - 5;
                            }
                        }
                        // Car Ready to accelerate
                        else {
                            accelerate(carArray[i]._carID);
                        }

                        carArray[i]._yPos = precisionRound(ypos + carArray[i]._speed, 3);
                    }
                    carFinished = false;
                }
            }

            // TODO This works but isn't fully connected to the front end
            if (carFinished == true) {
                carArray.splice(i,1);
            }

            // Updates the carArray with new positions and sends data to client
            carCreation.setCarArr(carArray);

            dcSocket.emit('DumbCarArray', carCreation.getFrontendCarArr());
        }, 100); // How often the server updates the client
    });
};

// Trevor's debugging statements
// console.log("x",carArray[i]._xPos,"y",carArray[i]._yPos,"speed:",carArray[i]._speed);
// console.log("xdes",carArray[i].xDestination,"ydes",carArray[i].yDestination,"speed:",carArray[i]._speed);
