module.exports = class carObject {

  constructor(carId, xStart, yStart, xDestination, yDestination, carType, route) {
    this.carId = carId;
    this.xStart = xStart;
    this.yStart = yStart;
    this.xDestination = xDestination;
    this.yDestination = yDestination;
    this.carType = carType;
    this.route = route;

    this.speed = 0;
    this.orientation;
    this.xPos;
    this.yPos;
    this.currentEdgeId;
    this.currentLane;
  }

  get xPos() {
    return this._xPos;
  }
  get yPos() {
    return this._yPos;
  }
  get speed() {
    return this._speed;
  }
  get orientation() {
    return this._orientation;
  }
  get currentEdgeId() {
    return this._currentEdgeId;
  }
  get currentLane() {
    return this._currentLane;
  }
  set xPos(value) {
    this._xPos = value;
  }
  set yPos(value) {
    this._yPos = value;
  }
  set speed(value) {
    this._speed = value;
  }
  set orientation(value) {
    this._orientation = value;
  }
  set currentEdgeId(value) {
    this._currentEdgeId = value;
  }
  set currentLane(value) {
    this._currentLane = value;
  }
}