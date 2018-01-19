var primaryCtx = document.getElementById("canvas").getContext("2d");
//var secondaryCanvas = document.createElement("canvas"), secondaryCtx = secondaryCanvas.getContext("2d");


//Initally draw the gride and cars on page load
window.onload = function() {
    drawGrid();
    drawCars();
}

/*
//calls the movement of the objects function and redisplays the objects
function refresh() {
    requestAnimationFrame(refresh);
    primaryCtx.save(); //Freeze redraw
    //primaryCtx.clearRect(0, 0, canvas.width, canvas.height);
    drawGrid();
    drawCars();
    primaryCtx.restore(); //And now do the redraw
}*/
