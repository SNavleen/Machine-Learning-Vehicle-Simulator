module.exports = class carObject{

  constructor(carID, xStart, yStart, xDestination, yDestination, carType) {
    this.carID = carID;
    this.xStart = xStart;
    this.yStart = yStart;
    this.xDestination = xDestination;
    this.yDestination = yDestination;
    this.carType = carType;

    this.speed = 0;

    this.orientation = 0;
    this.xPos = 0;
    this.yPos = 0;
  }

  get xPos(){
    return this._xPos;
  }
  get yPos(){
    return this._yPos;
  }
  get speed(){
    return this._speed;
  }
  get orientation(){
    return this._orientation;
  }
  set xPos(value){
    this._xPos = value;
  }
  set yPos(value){
    this._yPos = value;
  }
  set speed(value){
    this._speed = value;
  }
  set orientation(value){
    this._orientation = value;
  }
}
