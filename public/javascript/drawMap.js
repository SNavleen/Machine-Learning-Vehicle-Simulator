//Draw the grid/map
var map;
function drawMap(){
  if(map == undefined){
    var socket = io();
    socket.on('mapArray',function(data){
        console.log(data);
        map = data;
    });
  }
  // Not sure how to diconnect from socket
  // else{
  //   socket.on('disconnect', function(data){});
  // }
  try{
    // console.log(map.length);
    var i = 0;
    // primaryCtx.scale(-1, -1);
    while (i < map.length){
      primaryCtx.strokeStyle= "black";
      var StartxPos = map[i].StartxPos/1000,
          StartyPos = map[i].StartyPos/1000,
          EndxPos = map[i].EndxPos/1000,
          EndyPos = map[i].EndyPos/1000;
      // console.log(StartxPos, StartyPos, EndxPos, EndyPos);
      // Reset the current path
      primaryCtx.beginPath();
      // Staring point (10,45)
      primaryCtx.moveTo(StartxPos, StartyPos);
      // End point (180,47)
      primaryCtx.lineTo(EndxPos, EndyPos);
      // Make the line visible
      primaryCtx.stroke();
      i ++;
    }
  }catch(e){

  }


}
