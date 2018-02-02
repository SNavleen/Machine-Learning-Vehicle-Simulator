function sendMapToFront(){
	var graphObject = require('../models/graphObject.js');
	var map = new graphObject();
	var numEdges = map.getNumOfEdges();

	var frontEndMapArray = new Array(numEdges);
	for(var i = 0; i < numEdges; i++){
		var frontEndMap = {StartxPos: 0, StartyPos: 0, EndxPos: 0, EndyPos: 0, len: 0};
		var startNode = map.getStartNode(i);
		var endNode = map.getEndNode(i);
		var edgeObj = map.getEdgeObject(i);

		frontEndMap.StartxPos = startNode.x;
		frontEndMap.StartyPos = startNode.y;

		frontEndMap.EndxPos = endNode.x;
		frontEndMap.EndyPos = endNode.y;

		frontEndMap.len = edgeObj.length;

		frontEndMapArray[i] = frontEndMap;
		console.log(frontEndMap);
	}
}
module.exports = {sendMapToFront};