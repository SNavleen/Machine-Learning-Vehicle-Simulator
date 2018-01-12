var roads = require('/models.roadObject.js')
//module.exports = class mapObject{
	var city = new array(25);
	function createBaseCity(){

		//3x3 city
		//x lines
		city[0] = new roads(0,0,1,0);
		city[1] = new roads(1,0,2,0);

		city[2] = new roads(0,1,1,1);
		city[3] = new roads(1,1,2,1);

		city[4] = new roads(0,2,1,2);
		city[5] = new roads(1,2,2,2);

		//y lines
		city[6] = new roads(0,0,0,1);
		city[7] = new roads(0,1,0,2);

		city[8] = new roads(1,0,1,1);
		city[9] = new roads(1,1,1,2);

		city[10] = new roads(2,0,2,1);
		city[11] = new roads(2,1,2,2);

		//5x5 city
		//x  lines
		city[0] = new roads(2,0,3,0);
		city[1] = new roads(3,0,4,0);

		city[0] = new roads(2,1,3,1);
		city[1] = new roads(3,1,4,1);

		city[0] = new roads(2,0,3,0);
		city[1] = new roads(3,2,4,2);

		city[0] = new roads(2,0,3,0);
		city[1] = new roads(3,3,4,3);

		city[0] = new roads(2,0,3,0);
		city[1] = new roads(3,4,4,4);

		//y lines
		city[0] = new roads(0,2,0,3);
		city[1] = new roads(0,3,0,4);

		city[0] = new roads(1,2,1,3);
		city[1] = new roads(1,3,1,4);

		city[0] = new roads(2,2,2,3);
		city[1] = new roads(2,3,2,4);

		city[0] = new roads(3,2,3,3);
		city[1] = new roads(3,3,3,4);
		
		city[0] = new roads(4,2,4,3);
		city[1] = new roads(4,3,4,4);







// var city;


// 0,0  0,1 0,2
// 1,0	 1,1 1,2
// 2,0	 2,1 2,2

// carobject (0,0   0,2)
// 0,0.015 0.005
// 0.0.016	
		
// 		roadObject1
// 		movement.CheckCollistion(roadObject1, 0.015, 0.005);
// 		0,005 *
// 		roadOject1.contains(arrayCar[])

// city.add(roads(startx, starty,endx,endy)); 