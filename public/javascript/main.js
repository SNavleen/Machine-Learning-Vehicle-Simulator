
			var canvas
			var canvasContext;
			var gridSize = 5; 
			var gridArray = new Array(gridSize); //unused at the moment
			for (var i = 0; i < gridSize; i++) {
  				gridArray[i] = new Array(gridSize);
			}
			var numberOfCars = 500;
			var carArray = new Array(numberOfCars); 

			for (var i = 0; i < numberOfCars; i++) {//initializes all the car objects 
				var colour = getRandomColor();
  				carArray[i] = {xStart:0,yStart:0,xDestination:0,yDestination:0,xPosition:0,yPosition:0,carColour:colour};
			}
			randomPosition();

			//function for what happens when the page loads
			window.onload = function() {
				canvas = document.getElementById('canvas');
				canvasContext = canvas.getContext('2d');

				//sets the frame rate for the website

				var fps = 1;

				//sets the refresh interval for the website and how fast the objects get refreshed 
				setInterval(refresh, 1000/fps);

			}
			//calls the movement of the objects function and redisplays the objects 
			function refresh() {
				movement();
				display();
			}

			//how everything should be displayed 
			function display() {
				drawRect(0,0, canvas.width,canvas.height, 'white'); // clear screen
				drawGrid();
				drawCars();
				var socket = io.connect('/');
			    socket.emit('event', {message: "Hey this is a message from cilent"});
			    socket.on('event',function(data){	 
			    	canvasContext.font="30px Verdana";     
			    	var abc = data.outputToFront;
				    canvasContext.fillText("test " + abc, 600, 200);
				});
			}

			function drawCars(){
				for (var i = 0; i < numberOfCars; i++) {
					drawRect(carArray[i].xPosition,carArray[i].yPosition,30,20,carArray[i].carColour);
				}
			}

			function movement(){
				for (var i = 0; i < numberOfCars; i++) {

					if (carArray[i].xStart <carArray[i].xDestination){
						carArray[i].xPosition= carArray[i].xPosition + 5;
						carArray[i].xStart = carArray[i].xPosition/100;
					}
					else if(carArray[i].xStart >carArray[i].xDestination){
						carArray[i].xPosition= carArray[i].xPosition - 5;
						carArray[i].xStart = carArray[i].xPosition/100;
					}
					else if(carArray[i].yStart < carArray[i].yDestination){
						carArray[i].yPosition = carArray[i].yPosition + 5;
						carArray[i].yStart = carArray[i].yPosition/100;
					}
					else if(carArray[i].yStart > carArray[i].yDestination){
						carArray[i].yPosition = carArray[i].yPosition - 5;
						carArray[i].yStart = carArray[i].yPosition/100;
					}
				}
			}

			function drawGrid(){
				var i = 1;
				while (i <gridSize){
					var j =1;
					while (j < gridSize){
						canvasContext.strokeStyle= "black";
						canvasContext.strokeRect((i-1)*100,(j-1)*100,200,200);
						j = j+1
					}
					i = i+1;	
				}
			}

			function randomPosition(){
				for (var i = 0; i < numberOfCars; i++) {
				
					var x = Math.floor(Math.random() * 6);
					var y = Math.floor(Math.random() * 6);

					carArray[i].xDestination = x;
					carArray[i].yDestination = y;

					var x1 = Math.floor(Math.random() * 6);
					var y1 = Math.floor(Math.random() * 6);

					carArray[i].xStart = x1;
					carArray[i].yStart = y1;
					
					carArray[i].xPosition= 100*x1;
					carArray[i].yPosition= 100*y1;
				}
			}
			//function to draw the bricks
			function drawRect(topLeftX,topLeftY, boxWidth,boxHeight, fillColor) {
				canvasContext.fillStyle = fillColor;
				canvasContext.fillRect(topLeftX,topLeftY, boxWidth,boxHeight);
			}

			function getRandomColor() {
			    var letters = '0123456789ABCDEF';
			    var colour = '#';
			    for (var i = 0; i < 6; i++ ) {
			        colour += letters[Math.floor(Math.random() * 16)];
			    }
			    return colour;
			}
