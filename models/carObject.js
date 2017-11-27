module.exports = class carObject{
  // private var xStart, yStart;
  // private var xEnd, yEnd;
  // private var xPos, yPos;
  // private var carColour, carType;

  constructor(xStart, yStart, xEnd, yEnd, carColour, carType){
    this.xStart = xStart;
    this.yStart = yStart;
    this.xEnd = xEnd;
    this.yEnd = yEnd;
    this.carColour = carColour;
    this.carType = carType;

    this.xPos = 0;
    this.yPos = 0;
  }

  get xPos(){
    return this._xPos;
  }

  get yPos(){
    return this._yPos;
  }

  set xPos(value){
    this._xPos = value;
  }

  set yPos(value){
    this._yPos = value;
  }
}
