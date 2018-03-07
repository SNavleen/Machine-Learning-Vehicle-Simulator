var map = require('../views/mapCreate.js');
var carCreation = require('./carCreation.js');
var general = require('../views/general.js');
var carPositioning = require('./carPositioning.js');

carCreation.createDumbCars();
var carArray = carCreation.getCarArr();

// TODO See if io can be assigned to a var to move everything out of the export function
// TODO Clean up code and remove everything out of socket function (only keep socket events)
// TODO Create function to convert speed to km/h as an int
// TODO: move all the general functions to be used by all files in views in general.js (precisionRound, euclideanDistance, etc.)
// TODO: Once the car gets to the node, it does not turn yet
// TODO Handle all magic numbers (specifically for precisionRound)
// TODO ALSO check if precision round is still needed
// TODO Fix car speed usage (only use "speed" instead of "carCreation.getCar(carId)._speed")

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
  } else if (carCreation.getCar(carId)._speed > desiredSpeed) {
    carCreation.getCar(carId)._speed = carCreation.getCar(carId)._speed - 10;
  }
  return false;
}

// TODO Move this to general
// Determines the distance between two points on the map
function euclideanDistance(X1, Y1, X2, Y2) {
  var xDifference = general.difference(X1, X2);
  var yDifference = general.difference(Y1, Y2);
  var distance = Math.sqrt(xDifference * xDifference + yDifference * yDifference);
  return distance;
}

// Checks the distance of the nearest vehicle on a cars current road
function collisionAvoidanceCheck(carId) {
  var currentCar = carCreation.getCar(carId);
  var carsOnEdge = map.getCarsOnEdge(currentCar._currentEdgeId, currentCar._currentLane);
  var currentCarX = currentCar._xPos;
  var currentCarY = currentCar._yPos;
  var checkedCarX = 0;
  var checkedCarY = 0;
  var currentDistance;

  var shortestDistance = Number.MAX_SAFE_INTEGER; // resets the distance to max

  //console.log("cars on edge: ", carsOnEdge);
  // Check against each car currently on edge
  for (var i = 0; i < carsOnEdge.length; i++) {
    // Makes sure not to check itself
    // NOTE: carsOnEdge[i] may already be just the carId
    if (currentCar.carId != carsOnEdge[i]) {
      checkedCarX = carCreation.getCar(carsOnEdge[i])._xPos;
      checkedCarY = carCreation.getCar(carsOnEdge[i])._yPos;
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
  var currentCar = carCreation.getCar(carId);
  var currentIntersection = map.getEdgeObject(currentCar._currentEdgeId).getEndNode();
  var currentIntersectionQueue = currentIntersection._intersectionQueue;

  // Time out for when to remove a car from the intersectionQueue, this delay stops multiple cars from entering the intersection at the same time
  setTimeout(function() {
    currentIntersectionQueue.shift(); // Pops the first value of the queue
  }, 100);

  map.removeCarFromEdge(currentCar.carId, currentCar._currentEdgeId, 1); // TODO Will have to update "0"
  //console.log(map.getEdgeObject(currentCar._currentEdgeId));
  currentCar._currentEdgeId = carPositioning.getNextEdgeInRoute(carId);
  map.insertCarToEdge(currentCar.carId, currentCar._currentEdgeId, 1); // TODO Will have to update "0"


}

// TODO This functionality might have to be changed a bit in the future. Once a road becomes free the car that has been waiting the longest should be the first to go (instead of getting sent to the back of the queue)
// Function to check if the next edge in the current vehicles path has space available to enter
function isRoadBlocked(carId) {
  var currentCar = carCreation.getCar(carId);
  var nextEdgeId = carPositioning.getNextEdgeInRoute(carId);
  var carsOnNextEdge = map.getCarsOnEdge(nextEdgeId, currentCar._currentLane);
  var nextEdgeStartNode = map.getStartNode(nextEdgeId);
  var nextEdgeStartNodeX = nextEdgeStartNode.x;
  var nextEdgeStartNodeY = nextEdgeStartNode.y;

  // Checks the distance of car from the startNode to determine if a car is blocking the road
  for (var i = 0; i < carsOnNextEdge.length; i++) {
    // Below determines the distance each vehicle on the edge is away from the intersection node
    var closestVehicleToIntersection = euclideanDistance(nextEdgeStartNodeX, nextEdgeStartNodeY, carCreation.getCar(carsOnNextEdge[i])._xPos, carCreation.getCar(carsOnNextEdge[i])._yPos);
    // Checks if a car is 45000 away from intersection an returns true to indicate that the intersection is currently blocked
    if (45000 >= closestVehicleToIntersection) {
      return true;
    }
  }

  return false;
}

// Used to handle checking when a car can go through an intersection
function intersectionCheck(carId) {
  var currentCar = carCreation.getCar(carId);
  var currentIntersection = map.getEdgeObject(currentCar._currentEdgeId).getEndNode();
  var currentIntersectionQueue = currentIntersection._intersectionQueue;

  // Adds current car to end of queue if it's not already in the list
  if (currentIntersectionQueue.indexOf(carId) == -1) {
    currentIntersection.addToIntersectionQueue(carId);
  }
  // Checks if the car has reached the front of the queue (Note: Actual dequeue is handled in switchEdge)
  if (currentIntersectionQueue.indexOf(carId) == 0) {
    // if next edge is full, remove car from front of queue and re-add it to the back
    if (isRoadBlocked(carId)) {
      currentIntersectionQueue.shift();
      currentIntersection.addToIntersectionQueue(carId);
    }
    // Trigger car to enter intersection
    else {
      adjustSpeed(carId, 500);
    }
  }
}

// Checks to see if the car needs to slow down and stop at the edge of an intersection
function stopForIntersectionCheck(distanceFromCenterX, distanceFromCenterY, instersectionOffsetX, instersectionOffsetY, speed, carOrientation) {
  // The car is travelling on the Y-Axis
  if (carOrientation == 90 || carOrientation == 270) {
    // Car needs to slow down in order to stop on the edge of the intersection
    if ((distanceFromCenterY - minimumSlowDownDistance(speed)) <= instersectionOffsetY + 500) {
      return true;
    } else {
      return false;
    }
  }
  // The car is travelling on the X-Axis
  else if (carOrientation == 0 || carOrientation == 180) {
    if ((distanceFromCenterX - minimumSlowDownDistance(speed)) <= instersectionOffsetX + 500) {
      return true;
    } else {
      return false;
    }
  }
}

// Checks to see whether a car is within 40,000 of being at an edge intersection
function approachingIntersectionCheck(distanceFromCenterX, distanceFromCenterY, instersectionOffsetX, instersectionOffsetY, carOrientation) {
  var approachingIntersectionDistance = 40000; // The distance the car begins to check whether is needs to stop for an intersection or not
  // The car is travelling on the Y-Axis
  if (carOrientation == 90 || carOrientation == 270) {
    // checks if the car is in range of the intersection
    if (instersectionOffsetY < distanceFromCenterY && distanceFromCenterY <= approachingIntersectionDistance) {
      return true;
    } else {
      return false;
    }
  }
  // The car is travelling on the X-Axis
  else if (carOrientation == 0 || carOrientation == 180) {
    if (instersectionOffsetX < distanceFromCenterX && distanceFromCenterX <= approachingIntersectionDistance) {
      return true;
    } else {
      return false;
    }
  }
}

// Main function for checking everything intersection related (mainly speed adjustments, collision avoidance)
function intersectionHandling(carInfo, carOrientation, speed, finalEdge, withinSlowDownRange, xPos, yPos, xDestination, yDestination) {
  // Intersection handling
  var carId = carInfo.carId;
  // Checks the remaining distance between the cars current position and current destination
  var xDifference = general.difference(xPos, xDestination);
  var yDifference = general.difference(yPos, yDestination);
  var instersectionOffsetX = 27000; // Offset of how far the edge of the intersection is away from the actual end of the edge (center of intersection)
  var instersectionOffsetY = 23000;

  var approachingIntersection = approachingIntersectionCheck(xDifference, yDifference, instersectionOffsetX, instersectionOffsetY, carOrientation);

  // Before final edge, xDiff & yDiff represent the current distance to the end node of the current edge
  // Once on the final edge, xDiff & yDiff are the how far away the car is from it's final destination (somewhere near the center of this edge)
  if (finalEdge == false) {
    // Checks if car has reached the end of its current edge
    if (xDifference <= 500 && yDifference <= 500) {
      switchEdge(carId);

      var nextEdgeId = carPositioning.getNextEdgeInRoute(carId);
      var needToChangeLane = carPositioning.checkIfLaneChangeIsNeeded(carInfo._currentLane, carInfo._currentEdgeId, nextEdgeId);

      carInfo._shouldChangeLane = needToChangeLane;
      // console.log(carInfo._shouldChangeLane);
    }
    // Checks if car is is approaching an intersection
    else if (approachingIntersection) {
      // Checks if car needs to slow down to stop at edge of intersection
      if (stopForIntersectionCheck(xDifference, yDifference, instersectionOffsetX, instersectionOffsetY, speed, carOrientation)) {
        adjustSpeed(carId, 0); // Stop at edge of intersection
        if (speed == 0) {
          intersectionCheck(carId);
        }
      } else if (!withinSlowDownRange) {
        adjustSpeed(carId, 500); // Attempt to move forward until at front of intersection
      }
    }
  }
  // Checks if the car has reached it's final destination
  else if (finalEdge == true && xDifference <= 500 && yDifference <= 500) {
    return null;
  }
  return approachingIntersection;
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

function changeLane(carInfo, xPos, xDestination, yPos, yDestination, speed, shouldChangeLane, slope) {
  if (carInfo._currentLane != shouldChangeLane) {
    if (slope == undefined) {
      carInfo._yPos = moveY(yPos, yDestination, speed);
      if (shouldChangeLane == 1) {
        carInfo._xPos = xPos - speed;
        carInfo._currentLane = precisionRound(carInfo._currentLane - 0.1, 2);
      } else if (shouldChangeLane == 2) {
        carInfo._xPos = xPos + speed;
        carInfo._currentLane = precisionRound(carInfo._currentLane + 0.1, 2);
      }
    } else if (slope == 0) {
      carInfo._xPos = moveX(xPos, xDestination, speed);
      if (shouldChangeLane == 1) {
        carInfo._yPos = yPos - speed;
        carInfo._currentLane = precisionRound(carInfo._currentLane - 0.1, 2);
      } else if (shouldChangeLane == 2) {
        carInfo._yPos = yPos + speed;
        carInfo._currentLane = precisionRound(carInfo._currentLane + 0.1, 2);
      }
    }
  } else {
    carInfo._shouldChangeLane = -1;
  }

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
  var carOrientation = map.getEdgeObject(carInfo._currentEdgeId).orientation;

  carInfo._orientation = carOrientation;

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
  var withinSlowDownRange = closestVehicleDistance < minimumSlowDownDistance(speed + 550);

  // Handles everything that deals with intersection movement, this is assigned to a var to ensure speed doesn't increase incorrectly
  var approachingIntersection = intersectionHandling(carInfo, carOrientation, speed, finalEdge, withinSlowDownRange, xPos, yPos, xDestination, yDestination);
  // Catches if the car is finished it's route and needs to be despawned
  if (approachingIntersection == null) {
    return null;
  }

  // Collision avoidance
  if (withinSlowDownRange) {
    // Must decelerate at maximum speed until stopped
    adjustSpeed(carId, 0);
  } else if (!approachingIntersection) {
    adjustSpeed(carId, 500); // TODO Need to set max speed to current roads speed limit
  }

  speed = precisionRound(carInfo._speed, 3); // Update speed from car object before moving

  var shouldChangeLane = carInfo._shouldChangeLane;

  if (shouldChangeLane == -1) {
    if (slope == undefined) {
      carInfo._yPos = moveY(yPos, yDestination, speed);
    } else if (slope == 0) {
      carInfo._xPos = moveX(xPos, xDestination, speed);
    } else {
      carInfo._xPos = moveX(xPos, xDestination, speed);
      yPos = Math.floor((slope * xPos) + intercept);
      carInfo._yPos = moveY(yPos, yDestination, speed);
    }
  } else {
    changeLane(carInfo, xPos, xDestination, yPos, yDestination, speed, shouldChangeLane, slope)
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
          map.removeCarFromEdge(carArray[i].carId, carArray[i]._currentEdgeId, 1);
          carArray.splice(i, 1);
          carCreation.spliceFrontendCarArr(i);
        }
        // Checks to make sure car hasn't been spliced and then updates the car array
        else {
          carArray[i] = currentCarInfo;
        }
      }
      dcSocket.emit('DumbCarArray', carCreation.getFrontendCarArr());
    }, 50); // How often the server updates the client (50) seems like a good rate at for 500 car speed)
  });
};
