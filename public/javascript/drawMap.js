var gridSize = 5;

//Draw the grid/map
function drawGrid(){
    var socket = io();

    socket.on('mapArray',function(data){
        console.log(data);
        var i = 1;
        while (i < gridSize){
            var j = 1;
            while (j < gridSize){
                primaryCtx.strokeStyle= "black";
                primaryCtx.strokeRect((i-1)*100,(j-1)*100,200,200);
                j = j+1
            }
            i = i+1;
        }
    }
}
