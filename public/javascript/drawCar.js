function drawCars(){
    var socket = io();
    socket.on('DumbCarArray',function(data){
      console.log(data);
      for (var i = 0; i < data.length; i++) {
      	primaryCtx.save(); 
        primaryCtx.fillStyle = data[i].carColour;
        primaryCtx.rotate(orientation*Math.PI/180);
        var orientation = 20; //orientation will be changed to the cars orientation that nav will send
        primaryCtx.fillRect(data[i]._xPos*100,data[i]._yPos*100,30,20);
        primaryCtx.restore();
      }
    });
    socket.on('RunCar',function(data){});

}
