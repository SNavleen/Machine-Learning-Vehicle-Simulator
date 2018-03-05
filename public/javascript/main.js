var mapCtx = document.getElementById("mapCanvas").getContext("2d");
var carCtx = document.getElementById("carCanvas").getContext("2d");
var ratio = 500; // This value is used to adjust recieved values to display properly in the front end

//Initally draw the gride and cars on page load
window.onload = function() {
    loadMapData();
    drawCars();
}
