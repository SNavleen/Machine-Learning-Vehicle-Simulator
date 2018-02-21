var dc_image = new Image();
dc_image.src = "../images/DC_0.PNG";

function drawCars() {
  var socket = io();

  socket.on('DumbCarArray', function(data) {
    // Prints out recieved DC array to console
    //console.log(data);
    primaryCtx.clearRect(0, 0, canvas.width, canvas.height);
    //drawMap();

    // TODO: fix so it the drawn car looks correct, (x, y) are being passed as correct values
    // TODO: fix the orientation since its passed but needs to be mirrored
    for (var i = 0; i < data.length; i++) {
      var xPos = data[i]._xPos / 1000;
      var yPos = data[i]._yPos / 1000;
      //to make the cars rotate for all angles and rotate when its turning
      //we can just change these if states to acount for 0-90 then 90-180 etc.
      if (data[i]._orientation == 0) {
        xPos = data[i]._xPos / 1000;
        yPos = data[i]._yPos / 1000;
      } else if (data[i]._orientation == 90) {
        //to make to along the line i added -10 because it looked like it was too far from the road
        xPos = data[i]._xPos / 1000 - 10;
        yPos = data[i]._yPos / 1000;
      } else if (data[i]._orientation == 180) {
        xPos = data[i]._xPos / 1000;
        yPos = data[i]._yPos / 1000 - 20;
        //added -20 here to make it go against the line
      } else if (data[i]._orientation == 270) {
        //changed it to -30 so that it would look like its on the line
        xPos = data[i]._xPos / 1000 - 30;
        yPos = data[i]._yPos / 1000;
      } else {
        xPos = data[i]._xPos / 1000;
        yPos = data[i]._yPos / 1000;
      }

      drawRotatedCar(xPos, yPos, 40, 20, data[i]._orientation);
    }
  });
}

function drawRotatedCar(x, y, width, height, degrees) {

  // first save the untranslated/unrotated context
  primaryCtx.save();

  primaryCtx.beginPath();
  // move the rotation point to the center of the rect
  primaryCtx.translate(x + width / 2, y + height / 2);
  // rotate the rect
  primaryCtx.rotate(-degrees * Math.PI / 180);

  // draw the rect on the transformed context
  // Note: after transforming [0,0] is visually [x,y]
  //       so the rect needs to be offset accordingly when drawn
  primaryCtx.drawImage(dc_image, -width / 2, -height / 2, width, height);

  // restore the context to its untranslated/unrotated state
  primaryCtx.restore();

}
