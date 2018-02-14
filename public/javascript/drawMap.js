//Draw the grid/map
var map;
function drawMap(){
  if(map == undefined){
    var socket = io();
    socket.on('mapArray',function(data){
        //console.log(data);
        map = data;
    });
    if(map != undefined){
      socket.close();
    }
  }
  try{
    var i = 0;

    console.log("map length:",map.length);
    while (i < map.length){
      primaryCtx.strokeStyle= "black";
      var StartxPos = map[i].StartxPos/1000,
          StartyPos = map[i].StartyPos/1000,
          EndxPos = map[i].EndxPos/1000,
          EndyPos = map[i].EndyPos/1000;
      // Reset the current path
      primaryCtx.beginPath();
      primaryCtx.moveTo(StartxPos, StartyPos);
      primaryCtx.lineTo(EndxPos, EndyPos);
      // Make the line visible
      primaryCtx.stroke();
      i ++;
    }
  }catch(e){
    console.log(e);
  }
}
