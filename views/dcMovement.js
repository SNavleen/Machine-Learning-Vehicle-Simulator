var carCreation = require('./carCreation.js')



var carArray = carCreation.getCarArr();

function DumbCarMovement(){
    for (var i = 0; i < carArray.length; i++) {
        if (carArray[i]._xPos < carArray[i].xDestination){
            carArray[i]._xPos= carArray[i]._xPos + 0.05;
        }
        else if(carArray[i]._xPos > carArray[i].xDestination){
            carArray[i]._xPos= carArray[i]._xPos - 0.05;
        }
        else if(carArray[i]._yPos < carArray[i].yDestination){
            carArray[i]._yPos = carArray[i]._yPos + 0.05;
        }
        else if(carArray[i]._yPos > carArray[i].yDestination){
            carArray[i]._yPos = carArray[i]._yPos - 0.05;
        }
    }
    carCreation.setCarArr(carArray);
}
module.exports = {DumbCarMovement};
