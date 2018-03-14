var dc_image = new Image();
dc_image.src = "../images/DC_0.PNG";

function drawCars() {
  var carLength = 30;
  var carWidth = 15;

  var socket = io();
  socket.on('DumbCarArray', function(data) {
    carCtx.clearRect(0, 0, carCanvas.width, carCanvas.height); // Clears the canvas of all previous cars
    for (var i = 0; i < data.length; i++) {
      var xPos;
      var yPos;
      var currentLane = data[i]._currentLane;
      var shouldChangeLane = data[i]._shouldChangeLane;

      if (data[i]._orientation == 0) { //checks if the orientation is 0 degrees
        xPos = data[i]._xPos / ratio; //divides the backend xpos value by the front end ratio
        yPos = data[i]._yPos / ratio + 1; //adds + 1 to put it on the correct lane position
        if (currentLane == 2) { // checks if its in a higherlane so that it can add to put it in the right lane
          yPos += 17;
        } else if (currentLane > 1) {//checks if it is lane changing since 1.1-1.9 is indicating lane change
          if (shouldChangeLane == 2) {//checks if lane should be 2 so that it can increase to that lane
            yPos += 0.1;
          } else if (shouldChangeLane == 1) {//checks if lane should be 1 so that it can decrease to that lane
            yPos -= 0.1;
          }
        }

      } else if (data[i]._orientation == 90) {//checks if the orientation is 90 degrees
        xPos = data[i]._xPos / ratio + 8.5; //adds + 8.5 to put it on the correct lane position
        yPos = data[i]._yPos / ratio; //divides the backend xpos value by the front end ratio
        if (currentLane == 2) {// checks if its in a higherlane so that it can add to put it in the right lane
          xPos += 17;
        } else if (currentLane > 1) {//checks if it is lane changing since 1.1-1.9 is indicating lane change
          if (shouldChangeLane == 2) {//checks if lane should be 2 so that it can increase to that lane
            xPos += 0.1;
          } else if (shouldChangeLane == 1) {//checks if lane should be 1 so that it can decrease to that lane
            xPos -= 0.1;
          }
        }

      } else if (data[i]._orientation == 180) {//checks if the orientation is 180 degrees
        xPos = data[i]._xPos / ratio; //divides the backend xpos value by the front end ratio
        yPos = data[i]._yPos / ratio - 17; //subtracts - 17 to put it on the correct lane position
        if (currentLane == 2) {// checks if its in a higherlane so that it can subtract to put it in the right lane
          yPos -= 17;
        } else if (currentLane > 1) {//checks if it is lane changing since 1.1-1.9 is indicating lane change
          if (shouldChangeLane == 2) {//checks if lane should be 2 so that it can decrease to that lane
            xPos -= 0.1;
          } else if (shouldChangeLane == 1) {//checks if lane should be 1 so that it can increase to that lane
            xPos += 0.1;
          }
        }

      } else if (data[i]._orientation == 270) {//checks if the orientation is 270 degrees
        xPos = data[i]._xPos / ratio - 8.5; //subtracts - 8.5 to put it on the correct lane position
        yPos = data[i]._yPos / ratio; //divides the backend xpos value by the front end ratio
        if (currentLane == 2) { // checks if its in a higherlane so that it can subtract to put it in the right lane
          xPos -= 17;
        } else if (currentLane > 1) {//checks if it is lane changing since 1.1-1.9 is indicating lane change
          if (shouldChangeLane == 2) {//checks if lane should be 2 so that it can decrease to that lane
            yPos -= 0.1;
          } else if (shouldChangeLane == 1) {//checks if lane should be 1 so that it can increase to that lane
            yPos += 0.1;
          }
        }
      }
      drawRotatedCar(xPos, yPos, carLength, carWidth, data[i]._orientation);
    }
  });
}

function drawRotatedCar(x, y, width, height, degrees) {

  // first save the untranslated/unrotated context
  carCtx.save();
  carCtx.beginPath();
  // move the rotation point to the center of the rect
  carCtx.translate(x + width / 2, y + height / 2);
  // rotate the rect
  carCtx.rotate(-degrees * Math.PI / 180);
  // draw the rect on the transformed context
  // Note: after transforming [0,0] is visually [x,y] so the rect needs to be offset accordingly when drawn
  carCtx.drawImage(dc_image, -width / 2, -height / 2, width, height);
  // restore the context to its untranslated/unrotated state
  carCtx.restore();

}
