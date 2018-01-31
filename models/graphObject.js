var nodeObject = require('./nodeObject.js');
var nodeArray = new Array();
function readNodeFile(){
	var fs = require('fs');
	var readline = require('readline');
	var stream = require('stream');

	var instream = fs.createReadStream('./map/SiouxFalls_node.tntp');
	var outstream = new stream;
	var rl = readline.createInterface(instream, outstream);

	rl.on('line', function(line) {
		line = line.toString();
	  var arr = line.split(" ")[0].split("\t");
		var nodeId = arr[0];
		var x = arr[1];
		var y = arr[2];
		if(arr[0] != "Node"){
			var node = new nodeObject(nodeId, x, y);
			nodeArray.push(node);
		}
	});

	rl.on('close', function() {
	  // for(var i = 0; i < nodeArray.length; i++){
		// 	console.log(nodeArray[i]);
		// }
	});
}
