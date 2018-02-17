var map = require('../views/mapCreate.js');
var carCreation = require('./carCreation.js');
var general = require('../views/general.js');

carCreation.createDumbCars();
var carArray = carCreation.getCarArr();

// TODO See if io can be assigned to a var to move everything out of the export function
// TODO Clean up code and remove everything out of socket function (only keep socket events)
// TODO Create function to convert speed to km/h as an int
// TODO: move all the general functions to be used by all files in views in general.js (precisionRound, euclideanDistance, etc.)


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
    for (var i = 0; i < edgeArray.length; i++) {
      // Switch to this edge
      if (edgeArray[i].startNodeId == nextEdgeStart && edgeArray[i].endNodeId == nextEdgeEnd) {
        map.removeCarFromEdge(currentCar.carId, currentCar._currentEdgeId, 0); // TODO Will have to update "0"
        currentCar._currentEdgeId = edgeArray[i].edgeId;
        map.insertCarToEdge(currentCar.carId, currentCar._currentEdgeId, 0); // TODO Will have to update "0"
      }
    }
  } else {
    // TODO Car is done, handle this
  }

  return false;
}




function moveCar(carInfo) {
  // Get car information from the object
  var carId = carInfo.carId;
  var xPos = precisionRound(carInfo._xPos, 3);
  var yPos = precisionRound(carInfo._yPos, 3);
  var xDestination = precisionRound(carInfo.xDestination, 3);
  var yDestination = precisionRound(carInfo.yDestination, 3);
  var speed = precisionRound(carInfo._speed, 3);
  var carOrientation = carInfo._orientation;
  // Get the edge information from the object
  var edgeId = carInfo._currentEdgeId;
  var edgeOrientation = map.getEdgeObject(edgeId);
  // Finds shortest distance
  var closestVehicleDistance = collisionAvoidanceCheck(carId);
  // carFinished = true; // determines if a car has reached its destination or not

  // TODO Temporily hardcoded values, need to tweak once actual map is working
  // Collision avoidance

  if (closestVehicleDistance < minimumSlowDownDistance(speed + 10)) {
    // Must decelerate at maximum speed until stopped
    adjustSpeed(carId, 0);
  } else if (closestVehicleDistance < minimumSlowDownDistance(speed + 20)) {
    adjustSpeed(carId, 20);
  } else if (closestVehicleDistance < minimumSlowDownDistance(speed + 30)) {
    adjustSpeed(carId, 30);
  } else {
    adjustSpeed(carId, 500); // TODO Need to set max speed to current roads speed limit instead of 0.05
  }

  // checks if the car needs to move along the xaxis
  //console.log("EDGE ID",EdgeID);
  //console.log("ORIENTATION:",map.getEdgeObject(29).orientation);

  var xDifference = general.difference(xPos, xDestination);
  var yDifference = general.difference(yPos, yDestination);

  // if (xDifference > 0.00001 || yDifference > 0.00001) { // TODO: dont know if i need this
  // console.log("TEST1");

  if (Math.abs(carOrientation) == 90 || Math.abs(carOrientation) == 270) {
    if (yPos > yDestination) {
      yPos = precisionRound(yPos - carInfo._speed, 3);
    } else if (yPos < yDestination) {
      yPos = precisionRound(yPos + carInfo._speed, 3);
    }
    // console.log("yPos: ", yPos);
    carInfo._yPos = yPos;
  } else if (Math.abs(carOrientation) == 0 || Math.abs(carOrientation) == 180) {
    if (xPos > xDestination) {
      xPos = precisionRound(xPos - carInfo._speed, 3);
    } else if (xPos < xDestination) {
      xPos = precisionRound(xPos + carInfo._speed, 3);
    }
    // console.log("xPos: ", xPos);
    carInfo._xPos = xPos;
  } else {
    //     console.log("TEST6");
    // var A = [carArray[i]._xPos, carArray[i]._yPos];
    //     var B = [map.getEndNode(EdgeID).x, map.getEndNode(EdgeID).y];
    //     var m = slope(A, B);
    //     var b = intercept(A, m);
    //     var x = parseInt(A[0]) + 500;
    //     var n = parseInt(B[0]);
    //     var coordinates = [];
    //     console.log("orientation", carArray[i]._orientation);
    //
    //     console.log("point 1", A[0], A[1]);
    //     console.log("point 2", B[0], B[1]);
    //     console.log("slope", m);
    //     console.log("intercept", b);
    //     console.log("RANGE:", A[0], B[0]);
    //     var y = m * x + b;
    //     // for (x; x <= n;x+= 50) {
    //     //   console.log("TEST");
    //     //   var y = m * x + b;
    //     //   coordinates.push([x, y]);
    //     // }
    //     console.log("TREST FIN");
    //     console.log(x, y);
    //     carArray[i]._xPos = x;
    //     carArray[i]._yPos = y;
    //   }
  }


  // carFinished = false;
  //     }

  // console.log(carInfo);
  return carInfo;
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
        carArray[i] = moveCar(carArray[i]);
      }
      //  TODO This works but isn't fully connected to the front end
      if (carFinished == true) {
        carArray.splice(i, 1);
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