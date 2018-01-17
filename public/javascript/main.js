var primaryCtx = document.getElementById("canvas").getContext("2d");
var secondaryCanvas = document.createElement("canvas"),
    secondaryCtx = secondaryCanvas.getContext("2d");


//function for what happens when the page loads
window.onload = function() {
    //sets the frame rate for the website
    var fps = 120;
    //sets the refresh interval for the website and how fast the objects get refreshed
    //setInterval(refresh, 1000/fps);
    drawGrid(); // temporarily removed refresh call until we have proper data sending
    drawCars();
}

//calls the movement of the objects function and redisplays the objects
function refresh() {
    requestAnimationFrame(refresh);
    primaryCtx.save(); //Freeze redraw
    //primaryCtx.clearRect(0, 0, canvas.width, canvas.height);
    drawGrid();
    drawCars();
    primaryCtx.restore(); //And now do the redraw
}
