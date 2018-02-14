var map = require('../views/mapCreate.js');
var carCreation = require('./carCreation.js')

carCreation.createDumbCars();
var carArray = carCreation.getCarArr();

// TODO See if io can be assigned to a var to move everything out of the export function
// TODO Clean up code and remove everything out of socket function (only keep socket events)
// TODO Create function to convert speed to km/h as an int

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
        currentSpeed = precisionRound(currentSpeed - 10, 2);
    }
    return totalStoppingDistance;
}

// Function for adjusting cars to specified speed
function adjustSpeed(carID, desiredSpeed) {

    if (carCreation.getCar(carID)._speed < desiredSpeed) {
        carCreation.getCar(carID)._speed = carCreation.getCar(carID)._speed + 10;
        //console.log("Speed 1 :",carCreation.getCar(carID)._speed);
    }
    else if (carCreation.getCar(carID)._speed > desiredSpeed) {
        carCreation.getCar(carID)._speed = carCreation.getCar(carID)._speed - 10;
                //console.log("Speed 2:",carCreation.getCar(carID)._speed);

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
function collisionAvoidanceCheck(carID) {
    var currentCar = carCreation.getCar(carID);
    var carsOnEdge = map.getCarsOnEdge(currentCar._currentEdgeID);
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

// This moves the current car onto the next edge in its route
function switchEdge(carID) {
    var edgeArray = map.getEdgeArray();
    var currentCar = carCreation.getCar(carID);
    var currentEdgeEnd = map.getEdgeObject(currentCar._currentEdgeID).endNodeId;
    var nextEdgeStart = currentEdgeEnd;
    
    // Finds the ID of the next node in the route
    if (nextEdgeStart != currentCar.route[currentCar.route.length - 1]) {
        var nextEdgeEnd = currentCar.route[currentCar.route.indexOf(nextEdgeStart) + 1];

        // Scan through all edges to find the next one on the route
        for (var i = 0; i < edgeArray.length; i++) {
            // Switch to this edge
            if (edgeArray[i].startNodeId == nextEdgeStart && edgeArray[i].endNodeId == nextEdgeEnd) {
                map.removeCarFromEdge(currentCar.carID, currentCar._currentEdgeID, 0); // TODO Will have to update "0"
                currentCar._currentEdgeID = edgeArray[i].edgeId;
                map.insertCarToEdge(currentCar.carID, currentCar._currentEdgeID, 0); // TODO Will have to update "0"
            }
        }
    }

    else {
        // TODO Car is done, handle this
    }

    return false;
}
function slope(a, b) {
    if (a[0] == b[0]) {
        return null;
    }

    return (b[1] - a[1]) / (b[0] - a[0]);
}
function intercept(point, slope) {
    if (slope === null) {
        // vertical line
        return point[0];
    }

    return point[1] - slope * point[0];
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
                var speed = precisionRound(carArray[i]._speed,3); // TODO Remove if not being used


                var closestVehicleDistance = collisionAvoidanceCheck(carArray[i].carID); // Finds shortest distance
                carFinished = true; // determines if a car has reached its destination or not

                // TODO Temporily hardcoded values, need to tweak once actual map is working
                // Collision avoidance

                if (closestVehicleDistance < minimumSlowDownDistance(carArray[i]._speed + 10)) {
                    // Must decelerate at maximum speed until stopped
                    adjustSpeed(carArray[i].carID, 0);
                }
                else if (closestVehicleDistance < minimumSlowDownDistance(carArray[i]._speed + 20)) {
                    adjustSpeed(carArray[i].carID, 20);
                }
                else if (closestVehicleDistance < minimumSlowDownDistance(carArray[i]._speed + 30)) {
                    adjustSpeed(carArray[i].carID, 30);
                }
                else {
                    adjustSpeed(carArray[i].  carID, 50); // TODO Need to set max speed to current roads speed limit instead of 0.05
                }

                // checks if the car needs to move along the xaxis
                var EdgeID = carArray[i]._currentEdgeID;
                //console.log("EDGE ID",EdgeID);
                //console.log("ORIENTATION:",map.getEdgeObject(29).orientation);

                if((difference(xpos,xdes)>0.00001) || (difference(ypos,ydes) > 0.00001)){
                                          console.log("TEST1");

                  if(map.getEdgeObject(EdgeID).orientation == 90 || map.getEdgeObject(EdgeID).orientation == -90 || map.getEdgeObject(EdgeID).orientation == 270 || map.getEdgeObject(EdgeID).orientation == -270){
                                             console.log("TEST2");

                     if (ypos > ydes) {
                         carArray[i]._yPos = precisionRound(ypos - carArray[i]._speed, 3);
                     }
                     else if (ypos < ydes) {
                         carArray[i]._yPos = precisionRound(ypos + carArray[i]._speed, 3);
                    }
                    
                  }
                  else if(map.getEdgeObject(EdgeID).orientation == 0 ||  map.getEdgeObject(EdgeID).orientation == 180 || map.getEdgeObject(EdgeID).orientation == -180){
                                            console.log("TEST3");

                     if (xpos > xdes) {
                        console.log("TEST4");
                        console.log(carArray[i]._speed);
                         carArray[i]._xPos = precisionRound(xpos - carArray[i]._speed, 3);
                     }
                     else if (xpos < xdes) {
                      console.log("Test5");
                      console.log(carArray[i]._speed);
                         carArray[i]._xPos = precisionRound(xpos + carArray[i]._speed, 3);
                    }

                  }
                  else{
                    console.log("TEST6");
                    var EdgeID = carArray[i]._currentEdgeID;
                    var A = [carArray[i]._xPos,carArray[i]._yPos];
                    var B = [map.getEndNode(EdgeID).x,map.getEndNode(EdgeID).y];
                    var m = slope(A, B);
                    var b = intercept(A, m);
                    var x = parseInt(A[0])+500;
                    var n = parseInt(B[0]);
                    var coordinates = [];
                                        console.log("orientation", carArray[i]._orientation);

                      console.log("point 1",A[0],A[1]);
                    console.log("point 2",B[0],B[1]);
               console.log("slope",m);
              console.log("intercept",b);
  console.log("RANGE:",A[0],B[0]);
                    var y = m * x+ b;
                    // for (x; x <= n;x+= 50) {
                    //   console.log("TEST");
                    //   var y = m * x + b;
                    //   coordinates.push([x, y]);
                    // }
                    console.log("TREST FIN");
                    console.log(x,y);
                    carArray[i]._xPos = x;
                    carArray[i]._yPos = y;
                  }
                }

                //removed because obsolete 
                // if (difference(xpos,xdes) > 0.0001) {
                //     // Checks if the car needs to move left or right
                //     if (xpos > xdes) {
                //         carArray[i]._xPos = precisionRound(xpos - carArray[i]._speed, 3);
                //     }
                //     else if (xpos < xdes) {
                //         carArray[i]._xPos = precisionRound(xpos + carArray[i]._speed, 3);
                //     }
                //     carFinished = false;
                // }
                // else if (difference(ypos,ydes) > 0.0001) {
                //     // If the car is heading north
                //     if (ypos > ydes) {
                //         // Conditional for when the car is starting north but hasn't yet fully turned
                //         if (carArray[i]._orientation != 90) {
                //             // TODO Temporarily just sets speed to 0
                //             carArray[i]._speed = 0; // Turning speed

                //             // Checks if the car needs to turn left heading north
                //             if (carArray[i]._orientation >= 0 && carArray[i]._orientation < 90) {
                //                 carArray[i]._orientation = carArray[i]._orientation + 5;
                //             }
                //             // Check if car needs to turn right heading north
                //             else if (carArray[i]._orientation > 90 && carArray[i]._orientation <= 180) {
                //                 carArray[i]._orientation = carArray[i]._orientation - 5;
                //             }
                //         }

                //         carArray[i]._yPos = precisionRound(ypos - carArray[i]._speed, 5);
                //     }
                //     // If the car is heading south
                //     else {
                //         if (carArray[i]._orientation != 270) {
                //             carArray[i]._speed = 0; // Turning speed

                //             // Allows for right turns heading south by setting orientation from 0 to 360
                //             if (carArray[i]._orientation == 0) {
                //                 carArray[i]._orientation = 360;
                //             }
                //             // TODO Will need to change orientation base on next roads orientation
                //             // Check if car needs to turn left heading south
                //             if (carArray[i]._orientation >= 180 && carArray[i]._orientation < 270) {
                //                 carArray[i]._orientation = carArray[i]._orientation + 5;
                //             }
                //             // Check if car needs to turn right heading south
                //             else if (carArray[i]._orientation > 270 && carArray[i]._orientation <= 360) {
                //                 carArray[i]._orientation = carArray[i]._orientation - 5;
                //             }
                //         }

                //         carArray[i]._yPos = precisionRound(ypos + carArray[i]._speed, 3);
                //     }
                     carFinished = false;
            //     }
            
            console.log(carArray[i]._xPos,carArray[i]._yPos);
          }
          //  TODO This works but isn't fully connected to the front end
            if (carFinished == true) {
                carArray.splice(i,1);
            }
          
            // Updates the carArray with new positions and sends data to client
            //carArray[0]= [247301,510000];
                        //carArray[0]._xPos = 3;
                        //carArray[0]._yPos = 2;

            carCreation.setCarArr(carArray);

            dcSocket.emit('DumbCarArray', carCreation.getFrontendCarArr());
        }, 1000); // How often the server updates the client
    });
};
