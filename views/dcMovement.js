var carCreation = require('./carCreation.js')

var carArray = carCreation.getCarArr();
var difference = function (a, b) { return Math.abs(a - b); }
function DumbCarMovement(){
    for (var i = 0; i < carArray.length; i++) {
    	 var xpos = carArray[i]._xPos*1000;
    	 parseInt(xpos,10);
    	 var ypos = carArray[i]._yPos*1000;
    	 parseInt(ypos,10);
    	 var speed = carArray[i]._speed*1000;
     	 parseInt(speed,10);

  	  console.log("x",carArray[i]._xPos,"y",carArray[i]._yPos,"speed:",carArray[i]._speed);
  	  console.log("xdes",carArray[i].xDestination,"ydes",carArray[i].yDestination,"speed:",carArray[i]._speed);

    	var achivedX = true;
    	var achivedY = true;
    	var dest = false;
        if (difference(carArray[i]._xPos,carArray[i].xDestination)>0.0001){
        	if(difference(xpos/1000,carArray[i].xDestination) <= (speed/1000)){
        		console.log("dfghusdfbghsbgshbjshkegwerkjhesrjgh					!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");

        		carArray[i]._speed = (speed - 10)/1000;
        		dest = true;
        	}
        	if(xpos/1000 > carArray[i].xDestination){
        		//Orientation driving right
        		//if(carArray[i]._orientation != 90){
        			//reorient car
        		//}
        		carArray[i]._xPos = (xpos - speed)/1000;
        	}
        	else{
        		//Orient driving left
        		carArray[i]._xPos = (xpos + speed)/1000;
        	}
        	achivedX = false;
        }

  //       else if(difference(carArray[i]._yPos,carArray[i].yDestination) > 0.0001){
  //       	if(difference(carArray[i]._yPos,carArray[i].yDestination) <= 0.05){
  //       		carArray[i]._speed = carArray[i]._speed - 0.01;
  //       		dest = true;
  //       	}
  //      }
		// 	if(carArray[i]._yPos > carArray[i].yDestination){
		// 		carArray[i]._yPos= carArray[i]._yPos - carArray[i]._speed;
		// 	}
		// 	else{
		// 		carArray[i]._yPos= carArray[i]._yPos + carArray[i]._speed;

		// 	}
		// 	achivedY = true;
		// }
        if(carArray[i]._speed < 0.05 && dest == false){
    		carArray[i]._speed = (speed + 10)/1000;
    	}
    	if(achivedX == true && achivedY == true){
    		carArray.splice(i,1);
    	}
    }
}
module.exports = {DumbCarMovement};
