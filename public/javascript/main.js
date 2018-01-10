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

function drawRect(topLeftX,topLeftY, boxWidth,boxHeight, fillColor) {
    canvasContext.fillStyle = fillColor;
    canvasContext.fillRect(topLeftX,topLeftY, boxWidth,boxHeight);
}

function drawCars(){
    var socket = io();
    socket.on('DumbCarArray',function(data){
    console.log(data);
    drawRect(data._xPos*100,data._yPos*100,30,20,data.carColour);
    //for (var i = 0; i < numberOfCars; i++) {
        //carArray[i]=data;
        //drawRect(carArray[i]._xPos,carArray[i]._yPos,30,20,carArray[i].carColour);
    //}
    });
}
