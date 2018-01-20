function drawCars(){
    var socket = io();
    var dc_image_0 = new Image();
    var dc_image_45 = new Image();
    var dc_image_90 = new Image();
    var dc_image_135 = new Image();
    var dc_image_180 = new Image();
    var dc_image_225 = new Image();
    var dc_image_270 = new Image();
    var dc_image_315 = new Image();

    dc_image_0.src = "../images/DC_0.PNG";
    dc_image_45.src = "../images/DC_45.PNG";
    dc_image_90.src = "../images/DC_90.PNG";
    dc_image_135.src = "../images/DC_135.PNG";
    dc_image_180.src = "../images/DC_180.PNG";
    dc_image_225.src = "../images/DC_225.PNG";
    dc_image_270.src = "../images/DC_270.PNG";
    dc_image_315.src = "../images/DC_315.PNG";

    socket.on('DumbCarArray',function(data){
    	console.log("Dumb Car Array Received");
        console.log(data);
        primaryCtx.clearRect(0, 0, canvas.width, canvas.height);
        drawGrid();

        for (var i = 0; i < data.length; i++) {
          	//primaryCtx.save();
            //var x = Math.PI/180;
            //var y = 0 *x;
            //console.log(y);
            //primaryCtx.translate(data[i]._xPos*100, data[i]._yPos*100-15);
            //primaryCtx.rotate(y);
            //console.log("orientation: " + data[i]._orientation);
            //var orientation = 20; //orientation will be changed to the cars orientation that nav will send
            if (data[i]._orientation == 0) {
                primaryCtx.drawImage(dc_image_0, data[i]._xPos*100, data[i]._yPos*100,40,20);
            }
            else if (data[i]._orientation == 90) {
                primaryCtx.drawImage(dc_image_90, data[i]._xPos*100, data[i]._yPos*100,20,40);
            }
            else if (data[i]._orientation == 180) {
                primaryCtx.drawImage(dc_image_180, data[i]._xPos*100, data[i]._yPos*100-20,40,20);
            }

            else if (data[i]._orientation == 270) {
                primaryCtx.drawImage(dc_image_270, data[i]._xPos*100-20, data[i]._yPos*100,20,40);
            }

            //primaryCtx.drawImage(dc_image_0, data[i]._xPos*100, data[i]._yPos*100-15);
            //primaryCtx.restore();
        }
    });
}

/*function rotate_point(pointX, pointY, originX, originY, angle) {
    angle = angle * Math.PI / 180.0;
    return {
        x: Math.cos(angle) * (pointX-originX) - Math.sin(angle) * (pointY-originY) + originX,
        y: Math.sin(angle) * (pointX-originX) + Math.cos(angle) * (pointY-originY) + originY
    };
}*/
