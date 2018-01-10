var canvas = document.getElementById('canvas');
var canvasContext = canvas.getContext('2d');

//function for what happens when the page loads
window.onload = function() {
    //sets the frame rate for the website
    var fps = 50;

    //sets the refresh interval for the website and how fast the objects get refreshed
    setInterval(refresh, 10000/fps);
}

//calls the movement of the objects function and redisplays the objects
function refresh() {
    display();
}

//how everything should be displayed
function display() {
    canvasContext.clearRect(0,0, canvas.width,canvas.height); // clear screen
    drawGrid();
    drawCars();
}
