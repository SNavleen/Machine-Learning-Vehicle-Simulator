var edgeObject = require('./edgeObject.js');
var edgeArray = new Array();
function readEdgeFile(cb){
	var fs = require('fs');
	var readline = require('readline');
	var stream = require('stream');

	var instream = fs.createReadStream('./map/SiouxFalls_net.tntp');
	var outstream = new stream;
	var rl = readline.createInterface(instream, outstream);
	var edgeId = 0;
	rl.on('line', function(line){
		line = line.toString();
	  var arr = line.split(" ");
		if(arr[0] != "<NUMBER" && arr[0] != "<FIRST" && arr[0] != "<END" && arr[0] != "~" ){
			arr = arr[0].split("\t");

			if(arr[1] != undefined){
				// edgeId, startNodeId, endNodeId, capacity, length, freeFlowTime, b, power, speedLimit, toll, type
				var startNodeId = arr[1];
				var endNodeId = arr[2];
				var capacity = arr[3];
				var length = arr[4];
				var freeFlowTime = arr[5];
				var b = arr[6];
				var power = arr[7];
				var speedLimit = arr[8];
				var toll = arr[9];
				var type = arr[10];
				var edge = new edgeObject(edgeId, startNodeId, endNodeId, capacity, length, freeFlowTime, b, power, speedLimit, toll, type);
				// console.log(edge);
				edgeArray.push(edge);
				// console.log(edgeArray[0]);
				edgeId ++;
			}
		}
	});

	rl.on('close', function(){
		cb();
	  // for(var i = 0; i < 3; i++){
		// 	console.log(edgeArray[i]);
		// }
	});
}

// console.log(edgeArray[0]);
module.exports = class graphObject{
  constructor(){
		var cb = ()=>{
			console.log(edgeArray[6]);
			var orientation = edgeArray[6]._orientation;
			console.log(orientation);
		};
		readEdgeFile(cb);

  }
}
