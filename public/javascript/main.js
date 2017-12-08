var canvas
var canvasContext;
var gridSize = 5;
var gridArray = new Array(gridSize); //unused at the moment
for (var i = 0; i < gridSize; i++) {
    gridArray[i] = new Array(gridSize);
}
var numberOfCars = 1;
var carArray = new Array(numberOfCars);


//function for what happens when the page loads
window.onload = function() {
    canvas = document.getElementById('canvas');
    canvasContext = canvas.getContext('2d');

    //sets the frame rate for the website

    var fps = 50;

    //sets the refresh interval for the website and how fast the objects get refreshed
    setInterval(refresh, 1000/fps);

}
//calls the movement of the objects function and redisplays the objects
function refresh() {
    //movement();
    display();
}

//how everything should be displayed
function display() {
    drawRect(0,0, canvas.width,canvas.height, 'white'); // clear screen
    drawGrid();
    drawCars();
}

function drawGrid(){
    var i = 1;
    while (i <gridSize){
        var j =1;
        while (j < gridSize){
            canvasContext.strokeStyle= "black";
            canvasContext.strokeRect((i-1)*100,(j-1)*100,200,200);
            j = j+1
        }
        i = i+1;
    }
}

function drawCars(){
    var socket = io.connect('/');
    socket.on('DumbCarMovement',function(data){
    console.log(data);
    drawRect(data._xPos,data._yPos,30,20,data.carColour);
    //for (var i = 0; i < numberOfCars; i++) {
        //carArray[i]=data;
        //drawRect(carArray[i]._xPos,carArray[i]._yPos,30,20,carArray[i].carColour);
    //}
    });
}

// function randomPosition(i){
//     var socket = io.connect('/');
//     socket.on('RandomizeCarPosition',function(data){
//         console.log(data);
//         carArray[i]=data;
//     });
// }
//function to draw the bricks
function drawRect(topLeftX,topLeftY, boxWidth,boxHeight, fillColor) {
    canvasContext.fillStyle = fillColor;
    canvasContext.fillRect(topLeftX,topLeftY, boxWidth,boxHeight);
}
