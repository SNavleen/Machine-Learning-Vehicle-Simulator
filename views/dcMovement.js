var carCreation = require('./carCreation.js')

carCreation.createDumbCars();
var carArray = carCreation.getCarArr();

// TODO See if io can be assigned to a var to move everything out of the export function
// TODO Clean up code and remove everything out of socket function (only keep socket events)
//The difference function calculates the numerical differnce between 2 points as an absolute value 
var difference = function (a, b) { 
  return Math.abs(a - b); 
}
//The addfact function is an addition factorial that returns the addition factorial value of a given number
var addfact = function (a) {
    var temp = 0;
    a = precisionRound(a,2);
    while(a > 0){
        temp  = precisionRound(a+temp,2);  
        a = precisionRound(a -0.01,2);
    }

    return temp;
}

function precisionRound(number, precision) {
  var factor = Math.pow(10, precision);
  return Math.round(number * factor) / factor;
}
// This functions allows io from app.js to be used
module.exports = function(io) {
    io.on('connection', function(dcSocket) {
        // Emit initial car position
        dcSocket.emit('DumbCarArray', carCreation.getFrontendCarArr());

        // Variables for tracking if all cars have reached destination
       // var movementFinished = false;
        // Loop for moving cars
        var carFinished = true;
        var speedflag = false;
        var tempspeed = 0;
        var dcMovementLoop = setInterval(function() { // Temporarily using interval to display cars moving slowly
            // This loop checks each car in carArray and moves it closer towards its destination
            for (var i = 0; i < carArray.length; i++) {

               //  console.log("x",carArray[i]._xPos,"y",carArray[i]._yPos,"speed:",carArray[i]._speed);
                 //console.log("xdes",carArray[i].xDestination,"ydes",carArray[i].yDestination,"speed:",carArray[i]._speed);

                var xpos = precisionRound(carArray[i]._xPos,3);
                var ypos = precisionRound(carArray[i]._yPos,3);
                var speed = precisionRound(carArray[i]._speed,3);
                var xdes = precisionRound(carArray[i].xDestination,3);
                var ydes = precisionRound(carArray[i].yDestination,3);
                // console.log(xpos,ypos,carArray[i]._orientation,carArray[i]._speed);
                //determines if a car has reached its destination or not
                carFinished = true;
                //checks if car is approaching destination
                var slow = false;
              //checks if the car needs to move along the xaxis
              if (difference(xpos,xdes)>0.0001){

                if(difference(xpos,xdes) <= addfact(speed)){

                  carArray[i]._speed = precisionRound(speed - 0.01,3);
                  slow=true;
                }

                if(xpos > xdes){
                 // console.log("HEEERRREE");
                  carArray[i]._orientation = 180;

                  carArray[i]._xPos = precisionRound(xpos - speed,3);
                }
                else{
                  carArray[i]._orientation = 0;
                  carArray[i]._xPos = precisionRound(xpos + speed,3);
                }
                carFinished = false;
              }

              else if(difference(ypos,ydes)>0.0001){
                //checks if the car is approaching the destination
                if((difference(ypos,ydes) <= addfact(speed)) && speedflag == false){
                  //decrements speed
                  carArray[i]._speed = precisionRound(speed - 0.01,3);
                  slow=true;
                }

                if(ypos > carArray[i].yDestination){
                  if(carArray[i]._orientation != 90){
                    console.log("!------ CASE 1");

                    //if(speedflag==false){
                      //tempspeed = precisionRound((carArray[i]._speed/9),9);
                    //}
                    speedflag = true;
                    carArray[i]._speed = 0.001111111111;
                    speed = 0.001111111111;
                    if(carArray[i]._orientation > 90){
                      carArray[i]._orientation = carArray[i]._orientation - 10;
                    }
                    else{
                      carArray[i]._orientation = carArray[i]._orientation + 10;
                    }

                  }
                  else if(speedflag == true){
                    console.log("!------ CASE 2  ");
                   // carArray[i]._speed = precisionRound((tempspeed*9,9));
                    carArray[i]._speed = 0.01;
                    speed = 0.01;
                    carArray[i]._orientation = 90;
                    speedflag = false;
                    
                  }
                  else{
                    console.log("!------ CASE 3");

                    carArray[i]._orientation = 90;
                  }
                 console.log(xpos,ypos,carArray[i]._orientation,carArray[i]._speed,slow);

                  carArray[i]._yPos = precisionRound(ypos - carArray[i]._speed,3);
                }
                else{
                  carArray[i]._orientation = 270;
                  carArray[i]._yPos = precisionRound(ypos + speed,3);
                }
                carFinished = false;
              }

              if(carArray[i]._speed < 0.05 && slow == false && speedflag == false){
                console.log("speed uo", speed);
                  carArray[i]._speed = precisionRound(speed + 0.01,3);
                  console.log("current speed",carArray[i]._speed);
              }
            }

          if(carFinished == true){
           carArray.splice(i,1);
          }

            // Updates the carArray with new positions and sends data to client
            carCreation.setCarArr(carArray);

            dcSocket.emit('DumbCarArray', carCreation.getFrontendCarArr());
        }, 100); // How often the server updates the client
    });
};


