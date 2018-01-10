// var numberOfCars = 1;
// var carArray = new Array(numberOfCars);

// function drawRect(topLeftX,topLeftY, boxWidth,boxHeight, fillColor) {
//     canvasContext.fillStyle = fillColor;
//     canvasContext.fillRect(topLeftX,topLeftY, boxWidth,boxHeight);
// }

// function drawCars(){
//     var socket = io.connect('/');
//     socket.on('DumbCarDisplay',function(data){
//     console.log(data);
//     drawRect(data._xPos,data._yPos,30,20,data.carColour);
//     //for (var i = 0; i < numberOfCars; i++) {
//         //carArray[i]=data;
//         //drawRect(carArray[i]._xPos,carArray[i]._yPos,30,20,carArray[i].carColour);
//     //}
//     });
// }

// function randomPosition(i){
//     var socket = io.connect('/');
//     socket.on('RandomizeCarPosition',function(data){
//         console.log(data);
//         carArray[i]=data;
//     });
// }
//function to draw the bricks
