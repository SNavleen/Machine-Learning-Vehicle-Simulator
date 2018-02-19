var map = require('../views/mapCreate.js');
var carCreation = require('./carCreation.js');
var general = require('../views/general.js');

carCreation.createDumbCars();
var carArray = carCreation.getCarArr();

// TODO See if io can be assigned to a var to move everything out of the export function
// TODO Clean up code and remove everything out of socket function (only keep socket events)
// TODO Create function to convert speed to km/h as an int
// TODO: move all the general functions to be used by all files in views in general.js (precisionRound, euclideanDistance, etc.)
// TODO: Once the car gets to the node, it does not turn yet

// A function used to round a float number to a specific precision
function precisionRound(number, precision) {
  var factor = Math.pow(10, precision);
  return Math.round(number * factor) / factor;
}

// Returns an additonal factorial of a given number (used to determine the stopping distance of the car)
var minimumSlowDownDistance = function(currentSpeed) {
  var totalStoppingDistance = 0;
  currentSpeed = precisionRound(currentSpeed, 2);

  while (currentSpeed > 0) {
    totalStoppingDistance = precisionRound(currentSpeed + totalStoppingDistance, 2);
    currentSpeed = precisionRound(currentSpeed - 10, 2);
  }
  return totalStoppingDistance;
}

// Function for adjusting cars to specified speed
function adjustSpeed(carId, desiredSpeed) {

  if (carCreation.getCar(carId)._speed < desiredSpeed) {
    carCreation.getCar(carId)._speed = carCreation.getCar(carId)._speed + 10;
    //console.log("Speed 1 :",carCreation.getCar(carId)._speed);
  } else if (carCreation.getCar(carId)._speed > desiredSpeed) {
    carCreation.getCar(carId)._speed = carCreation.getCar(carId)._speed - 10;
    //console.log("Speed 2:",carCreation.getCar(carId)._speed);

  }
  return false;
}

// Determines the distance between two cars
function euclideanDistance(currentCarX, currentCarY, checkedCarX, checkedCarY) {
  var xDifference = general.difference(currentCarX, checkedCarX);
  var yDifference = general.difference(currentCarY, checkedCarY);
  var distance = Math.sqrt(xDifference * xDifference + yDifference * yDifference);
  return distance;
}

// Checks the distance of the nearest vehicle on a cars current road
function collisionAvoidanceCheck(carId) {
  var currentCar = carCreation.getCar(carId);
  var carsOnEdge = map.getCarsOnEdge(currentCar._currentEdgeId);
  var currentCarX = currentCar._xPos;
  var currentCarY = currentCar._yPos;
  var checkedCarX = 0;
  var checkedCarY = 0;

  var shortestDistance = Number.MAX_SAFE_INTEGER; // resets the distance to max

  // Check against each car currently on edge
  for (var i = 0; i < carsOnEdge.length; i++) {
    // Makes sure not to check itself
    if (currentCar._carId != carsOnEdge[i]._carId) {
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
function switchEdge(carId) {
  var edgeArray = map.getEdgeArray();
  var currentCar = carCreation.getCar(carId);
  var currentEdgeEnd = map.getEdgeObject(currentCar._currentEdgeId).endNodeId;
  var nextEdgeStart = currentEdgeEnd;

  // Finds the ID of the next node in the route
  if (nextEdgeStart != currentCar.route[currentCar.route.length - 1]) {
    var nextEdgeEnd = currentCar.route[currentCar.route.indexOf(nextEdgeStart) + 1];

    // Scan through all edges to find the next one on the route
    for (var i = 1; i < edgeArray.length; i++) {
      // Switch to this edge
      if (edgeArray[i].startNodeId == nextEdgeStart && edgeArray[i].endNodeId == nextEdgeEnd) {
        map.removeCarFromEdge(currentCar.carId, currentCar._currentEdgeId, 0); // TODO Will have to update "0"
        currentCar._currentEdgeId = edgeArray[i].edgeId;
        map.insertCarToEdge(currentCar.carId, currentCar._currentEdgeId, 0); // TODO Will have to update "0"
      }
    }
  }

  return false;
}

function moveY(yPos, yDestination, speed) {
  if (yPos > yDestination) {
    yPos = precisionRound(yPos - speed, 3);
  } else if (yPos < yDestination) {
    yPos = precisionRound(yPos + speed, 3);
  }
  return yPos;
}

function moveX(xPos, xDestination, speed) {
  if (xPos > xDestination) {
    xPos = precisionRound(xPos - speed, 3);
  } else if (xPos < xDestination) {
    xPos = precisionRound(xPos + speed, 3);
  }
  return xPos;
}

function moveCar(carInfo) {
  // Get car information from the object
  var carId = carInfo.carId;
  var xPos = precisionRound(carInfo._xPos, 3);
  var yPos = precisionRound(carInfo._yPos, 3);
  var route = carInfo.route;
  var xDestination;
  var yDestination;
  var finalEdge = false;
  carInfo._orientation = map.getEdgeObject(carInfo._currentEdgeId).orientation;

  // Checks to see if car is on it's final edge and sets destination to actual final destination (somewhere near the center of this edge)
  if (map.getEdgeObject(carInfo._currentEdgeId).startNodeId == route[route.length - 2]) {
    xDestination = precisionRound(carInfo.xDestination, 3);
    yDestination = precisionRound(carInfo.yDestination, 3);
    finalEdge = true;
  }
  // The car is not yet on it's final edge so it's destination is set to the end node of it's current edge
  else {
    xDestination = precisionRound(map.getEdgeObject(carInfo._currentEdgeId).getEndNode().x, 3);
    yDestination = precisionRound(map.getEdgeObject(carInfo._currentEdgeId).getEndNode().y, 3);
  }

  var speed = precisionRound(carInfo._speed, 3);
  // Get the edge information from the object
  var edgeId = carInfo._currentEdgeId;
  var edgeStartNode = map.getStartNode(edgeId);
  var edgeEndNode = map.getEndNode(edgeId)
  // Orientation information
  var slope = general.slope(edgeStartNode, edgeEndNode);
  var intercept = general.intercept(edgeStartNode, slope);
  // Finds shortest distance
  var closestVehicleDistance = collisionAvoidanceCheck(carId);

  // TODO Temporily hardcoded values, need to tweak once actual map is working
  // Collision avoidance
  if (closestVehicleDistance < minimumSlowDownDistance(speed + 10)) {
    // Must decelerate at maximum speed until stopped
    //adjustSpeed(carId, 0);
  } else if (closestVehicleDistance < minimumSlowDownDistance(speed + 20)) {
    //adjustSpeed(carId, 20);
  } else if (closestVehicleDistance < minimumSlowDownDistance(speed + 30)) {
    //adjustSpeed(carId, 30);
  } else {
    adjustSpeed(carId, 250); // TODO Need to set max speed to current roads speed limit instead of 0.05
  }

  // Checks the remaining distance between the cars current position and current destination
  var xDifference = general.difference(xPos, xDestination);
  var yDifference = general.difference(yPos, yDestination);

  // Checks if car has reached the end of its current edge
  if (finalEdge == false && xDifference <= 250 && yDifference <= 250) {
    switchEdge(carInfo.carId);
  }
  // Checks if the car has reached it's final destination
  else if (finalEdge == true && xDifference <= 250 && yDifference <= 250) {
    return null;
  }

  if (slope == undefined) {
    carInfo._yPos = moveY(yPos, yDestination, speed);
  }
  else if (slope == 0) {
    carInfo._xPos = moveX(xPos, xDestination, speed);
  }
  else {
    carInfo._xPos = moveX(xPos, xDestination, speed);
    yPos = Math.floor((slope * xPos) + intercept);
    carInfo._yPos = moveY(yPos, yDestination, speed);
  }

  return carInfo;
}

// This functions allows io from app.js to be used
module.exports = function(io) {
  io.on('connection', function(dcSocket) {
    // Emit initial car positions
    dcSocket.emit('DumbCarArray', carCreation.getFrontendCarArr());

    // Loop for moving all dumb cars on an interval
    var dcMovementLoop = setInterval(function() {
      // This loop checks each car in carArray and moves it closer towards its destination
      for (var i = 0; i < carArray.length; i++) {
        var currentCarInfo = moveCar(carArray[i]);

        // If the move function returns null indicating that the current car is finished it's route
        if (currentCarInfo == null) {
          carArray.splice(i, 1);
          carCreation.spliceFrontendCarArr(i);
        }
        // Checks to make sure car hasn't been spliced and then updates the car array
        else {
          carArray[i] = currentCarInfo;
        }

        if (carArray.length < 10) { }
      }

      dcSocket.emit('DumbCarArray', carCreation.getFrontendCarArr());     
    }, 100); // How often the server updates the client
  });
};