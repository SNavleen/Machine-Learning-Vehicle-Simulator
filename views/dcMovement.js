var carCreation = require('./views/carCreation.js')


//setCarArr
//assume i have this
//var carArray;
//var speed;
var carArray = carCreation.getCarArr();
carCreation.setCarArr(DumbCarMovement);

function DumbCarMovement(){
    for (var i = 0; i < numberOfCars; i++) {  
        if (carArray[i].xStart <carArray[i].xDestination){
            carArray[i]._xPos= carArray[i]._xPos + 5;//math.random(0,10)
            // + speed --;

            // + speed ++;
            carArray[i].xStart = carArray[i]._xPos/100;
        }
        else if(carArray[i].xStart >carArray[i].xDestination){
            carArray[i]._xPos= carArray[i]._xPos - 5;
            carArray[i].xStart = carArray[i]._xPos/100;
        }
        else if(carArray[i].yStart < carArray[i].yDestination){
            carArray[i]._yPos = carArray[i]._yPos + 5;
            carArray[i].yStart = carArray[i]._yPos/100;
        }
        else if(carArray[i].yStart > carArray[i].yDestination){
            carArray[i]._yPos = carArray[i]._yPos - 5;
            carArray[i].yStart = carArray[i]._yPos/100;
        }
    }
    return carArray;
}
