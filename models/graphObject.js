var edgeObject = require('./edgeObject.js');
var edgeArray = new Array();
function readEdgeFile(cb){
	var fs = require('fs');
	var file = "./map/SiouxFalls_net.tntp";
	fs.readFile(file, function(err, buf){
		var lines = buf.toString();
	  var line = lines.split("\n");
		var edgeId = 0;
		// console.log(line);
		for(var i = 0; i < line.length; i++){
			// console.log(line[i].includes("NUMBER"));
			// console.log(line[i]);
			if(!line[i].startsWith("<") && !line[i].startsWith("~")){
				var word = line[i].split("\t");
				// console.log(word);
				if(word[1] != undefined){
				// 	// edgeId, startNodeId, endNodeId, capacity, length, freeFlowTime, b, power, speedLimit, toll, type
					var startNodeId = word[1];
					var endNodeId = word[2];
					var capacity = word[3];
					var length = word[4];
					var freeFlowTime = word[5];
					var b = word[6];
					var power = word[7];
					var speedLimit = word[8];
					var toll = word[9];
					var type = word[10];
					var edge = new edgeObject(edgeId, startNodeId, endNodeId, capacity, length, freeFlowTime, b, power, speedLimit, toll, type);
					console.log(edge);
					edgeArray.push(edge);
					// console.log(edgeArray[0]);
					edgeId ++;
				}
			}
		}
	});
  //
	// var stream = require('stream');
  //
	// var instream = fs.createReadStream('');
	// var outstream = new stream;
	// var rl = readline.createInterface(instream, outstream);
	// rl.on('line', function(line){
	// 	line = line.toString();
	  // var word = line.split(" ");
		// if(word[0] != "<NUMBER" && word[0] != "<FIRST" && word[0] != "<END" && word[0] != "~" ){
		// 	word = word[0].split("\t");
    //
		// 	if(word[1] != undefined){
		// 		// edgeId, startNodeId, endNodeId, capacity, length, freeFlowTime, b, power, speedLimit, toll, type
		// 		var startNodeId = word[1];
		// 		var endNodeId = word[2];
		// 		var capacity = word[3];
		// 		var length = word[4];
		// 		var freeFlowTime = word[5];
		// 		var b = word[6];
		// 		var power = word[7];
		// 		var speedLimit = word[8];
		// 		var toll = word[9];
		// 		var type = word[10];
		// 		var edge = new edgeObject(edgeId, startNodeId, endNodeId, capacity, length, freeFlowTime, b, power, speedLimit, toll, type);
		// 		// console.log(edge);
		// 		edgeArray.push(edge);
		// 		// console.log(edgeArray[0]);
		// 		edgeId ++;
		// 	}
		// }
	// });
  //
	// rl.on('close', function(){
	// 	cb();
	//   // for(var i = 0; i < 3; i++){
	// 	// 	console.log(edgeArray[i]);
	// 	// }
	// });
}

// console.log(edgeArray[0]);
module.exports = class graphObject{
  constructor(){
		var cb = ()=>{
			// console.log(edgeArray[0]);
			// var orientation = edgeArray[0]._orientation;
			// console.log(orientation);
		};
		readEdgeFile(cb);

  }
}
