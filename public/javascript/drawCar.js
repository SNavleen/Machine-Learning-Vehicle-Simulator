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
      console.log(currentLane);

      if (data[i]._orientation == 0) {
        xPos = data[i]._xPos / ratio;
        yPos = data[i]._yPos / ratio + 1;
        if(currentLane=1){
          yPos+=17;
        }
        else if(currentLane>1){
          console.log("0 hit");
          xPos+=1.7;
        }

      } else if (data[i]._orientation == 90) {
        //to make to along the line i added -10 because it looked like it was too far from the road
        xPos = data[i]._xPos / ratio + 8.5;
        yPos = data[i]._yPos / ratio;
        if(currentLane=1){
          xPos+=17;
        }
        else if(currentLane>1){
          console.log("90 hit");
          xPos+=1.7;
        }

      } else if (data[i]._orientation == 180) {
        xPos = data[i]._xPos / ratio;
        yPos = data[i]._yPos / ratio - 17;
        if(currentLane=1){
          xPos-=17;
        }
        else if(currentLane>1){
          console.log("180 hit");
          xPos-=1.7;
        }
        //added -20 here to make it go against the line
      } else if (data[i]._orientation == 270) {
        //changed it to -30 so that it would look like its on the line
        xPos = data[i]._xPos / ratio - 8.5;
        yPos = data[i]._yPos / ratio;
        if(currentLane=1){
          xPos-=17;
        }
        else if(currentLane>1){
          console.log("270 hit");
          xPos-=1.7;
        }
      }
      //console.log("xpos " + xPos + " ypos " + yPos + " orientation " + data[i]._orientation);
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
