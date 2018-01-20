var carCreation = require('./carCreation.js')

var carArray = carCreation.getCarArr();

function DumbCarMovement(){
    var movementFinished = false;
    while (movementFinished != true) {
        for (var i = 0; i < carArray.length; i++) {
            if (carArray[i]._xPos < carArray[i].xDestination){
                carArray[i]._xPos= carArray[i]._xPos + 1;
            }
            else if(carArray[i]._xPos > carArray[i].xDestination){
                carArray[i]._xPos= carArray[i]._xPos - 1;
            }
            else if(carArray[i]._yPos < carArray[i].yDestination){
                carArray[i]._yPos = carArray[i]._yPos + 1;
            }
            else if(carArray[i]._yPos > carArray[i].yDestination){
                carArray[i]._yPos = carArray[i]._yPos - 1;
            }
            else {
                movementFinished = true;
            }
        }
        carCreation.setCarArr(carArray);
    }
}
module.exports = {DumbCarMovement};
