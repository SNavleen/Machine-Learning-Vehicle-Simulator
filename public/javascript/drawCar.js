var dc_image = new Image();
dc_image.src = "../images/DC_0.PNG";

function drawCars() {
  var carLength = 30;
  var carWidth = 15;

  var socket = io();
  socket.on('DumbCarArray', function(data) {
    carCtx.clearRect(0, 0, carCanvas.width, carCanvas.height); // Clears the canvas of all previous cars
    for (var i = 0; i < data.length; i++) {
      drawRotatedCar(data[i]._xPos / ratio, data[i]._yPos / ratio, carLength, carWidth, data[i]._orientation);
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
