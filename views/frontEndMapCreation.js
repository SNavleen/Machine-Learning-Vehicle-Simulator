module.exports = function(io){
	io.on('connection', function(mapSocket){
		console.log(mapSocket);
    if(!mapSocket.sentMydata){
			mapSocket.emit('mapArray', sendMapToFront());
      mapSocket.sentMydata = true;
    }
  });
};
function sendMapToFront(){
	var graphObject = require('../models/graphObject.js');
	var map = new graphObject();
	var numEdges = map.getNumOfEdges();

	var frontEndMapArray = new Array();
	for(var i = 0; i < numEdges; i++){
		var frontEndMap = {
												StartxPos: map.getStartNode(i).x,
												StartyPos: map.getStartNode(i).y,
											  EndxPos: map.getEndNode(i).x,
												EndyPos: map.getEndNode(i).y,
												len: map.getEdgeObject(i).length
											};
		// console.log(frontEndMap);
		frontEndMapArray.push(frontEndMap);
	}
	return frontEndMapArray;
}
