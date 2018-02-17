//Draw the grid/map
var map;
function drawMap(){
  if(map == undefined){
    var socket = io();
    socket.on('mapArray',function(data){
        //console.log(data);
        map = data;
    });
    if(map != undefined){
      socket.close();
    }
  }
  try{
    //greay background
    primaryCtx.fillStyle = "#D3D3D3";
    primaryCtx.fillRect(0,0,900,1100);

    var i = 0;
    while (i < map.length){
      var ratio = 500;
      var StartxPos = map[i].StartxPos/ratio,
          StartyPos = map[i].StartyPos/ratio,
          EndxPos = map[i].EndxPos/ratio,
          EndyPos = map[i].EndyPos/ratio,
          angle = map[i].orientation;
      
      if(angle<0){
        angle = 360 + angle;
      }


      //road variables
      var widthRoads = 70;
      var lineWidth = 3;
      var middleLane = widthRoads/2;
      var whiteLines = middleLane/2;

      //draw main black road
      drawLines(StartxPos,StartyPos,EndxPos,EndyPos,"black",widthRoads,[0]);

      //make intersections black
      primaryCtx.fillStyle = "black";
      primaryCtx.fillRect(StartxPos-middleLane,StartyPos-middleLane,widthRoads,widthRoads);

      //variables for yellow line
      var yellowx1=StartxPos,yellowy1=StartyPos,yellowx2=EndxPos,yellowy2=EndyPos;

      //variables to dashed white lines
      var white1x1,white1y1,white1x2,white1y2;
      var white2x1,white2y1,white2x2,white2y2;

      //roadStopLine variable
      var roadStopLine1x1,roadStopLine1y1,roadStopLine1x2,roadStopLine1y2;
      var roadStopLine2x1,roadStopLine2y1,roadStopLine2x2,roadStopLine2y2;

      if(angle==0){
        yellowx1 = StartxPos+middleLane;
        yellowx2 = EndxPos -middleLane;

        white1x1 = yellowx1;
        white1x2 = yellowx2;
        white1y1 = StartyPos + whiteLines;
        white1y2 = EndyPos + whiteLines;

        white2x1 = yellowx1;
        white2x2 = yellowx2;
        white2y1 = StartyPos - whiteLines;
        white2y2 = EndyPos - whiteLines;

        roadStopLine1x1= yellowx1;
        roadStopLine1y1= yellowy1;
        roadStopLine1x2= yellowx1;
        roadStopLine1y2 = yellowy1 - middleLane;

        roadStopLine2x1= yellowx2;
        roadStopLine2y1= yellowy2;
        roadStopLine2x2= yellowx2;
        roadStopLine2y2 = yellowy2 + middleLane;

      }
      else if(angle==90){
        yellowy1 = StartyPos+middleLane;
        yellowy2 = EndyPos-middleLane;

        white1y1 = yellowy1;
        white1y2 = yellowy2;
        white1x1 = StartxPos + whiteLines;
        white1x2 = EndxPos + whiteLines;

        white2y1 = yellowy1;
        white2y2 = yellowy2;
        white2x1 = StartxPos - whiteLines;
        white2x2 = EndxPos - whiteLines;

        roadStopLine1x1= yellowx1;
        roadStopLine1y1= yellowy1;
        roadStopLine1x2= yellowx1+middleLane;
        roadStopLine1y2 = yellowy1;

        roadStopLine2x1= yellowx2;
        roadStopLine2y1= yellowy2;
        roadStopLine2x2= yellowx2 - middleLane;
        roadStopLine2y2 = yellowy2;
      }
      else if(angle==180){
        yellowx1 = StartxPos-middleLane;
        yellowx2 = EndxPos+middleLane;

        white1x1 = yellowx1;
        white1x2 = yellowx2;
        white1y1 = StartyPos + whiteLines;
        white1y2 = EndyPos + whiteLines;

        white2x1 = yellowx1;
        white2x2 = yellowx2;
        white2y1 = StartyPos - whiteLines;
        white2y2 = EndyPos - whiteLines;

        roadStopLine1x1= yellowx1;
        roadStopLine1y1= yellowy1;
        roadStopLine1x2= yellowx1;
        roadStopLine1y2 = yellowy1 + middleLane;

        roadStopLine2x1= yellowx2;
        roadStopLine2y1= yellowy2;
        roadStopLine2x2= yellowx2;
        roadStopLine2y2 = yellowy2 - middleLane;
      }
      else if(angle==270){
        yellowy1 = StartyPos-middleLane;
        yellowy2 = EndyPos+middleLane;

        white1y1 = yellowy1;
        white1y2 = yellowy2;
        white1x1 = StartxPos + whiteLines;
        white1x2 = EndxPos + whiteLines;

        white2y1 = yellowy1;
        white2y2 = yellowy2;
        white2x1 = StartxPos - whiteLines;
        white2x2 = EndxPos - whiteLines;

        roadStopLine1x1= yellowx1;
        roadStopLine1y1= yellowy1;
        roadStopLine1x2= yellowx1-middleLane;
        roadStopLine1y2 = yellowy1;

        roadStopLine2x1= yellowx2;
        roadStopLine2y1= yellowy2;
        roadStopLine2x2= yellowx2 + middleLane;
        roadStopLine2y2 = yellowy2;
      }

      //draw the lines
      drawLines(yellowx1,yellowy1,yellowx2,yellowy2,"yellow",lineWidth,[0]);
      drawLines(white1x1,white1y1,white1x2,white1y2,"white",lineWidth,[5]);
      drawLines(white2x1,white2y1,white2x2,white2y2,"white",lineWidth,[5]);
      drawLines(roadStopLine1x1,roadStopLine1y1,roadStopLine1x2,roadStopLine1y2,"white",lineWidth,[0]);
      drawLines(roadStopLine2x1,roadStopLine2y1,roadStopLine2x2,roadStopLine2y2,"white",lineWidth,[0]);
      i ++;
    }
  }catch(e){
    console.log(e);
  }
}

function drawLines(startX,startY, endX,endY, fillColor,width,dash) {
  primaryCtx.save()
  primaryCtx.strokeStyle= fillColor;
  primaryCtx.lineWidth = width;
  primaryCtx.beginPath();
  primaryCtx.setLineDash(dash);
  primaryCtx.moveTo(startX, startY);
  primaryCtx.lineTo(endX, endY);
  primaryCtx.stroke();
  primaryCtx.restore();
}