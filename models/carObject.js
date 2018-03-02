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
    //-1 means its not changing lane, 1 means changing to the left lane, 0 means chaning to the right lane
    this.shouldChangeLane=-1;
    this.orientation;
    this.xPos;
    this.yPos;
    this.currentEdgeId;
    this.currentLane;
    // Sensors arrays and booleans
    // The sensor arrays will hold a list of carId that it know of

    // Left sensor by default it is set to false meaning no car is beside it
    this.lSensor = false;
    // Right sensor by default it is set to false meaning no car is beside it
    this.rSensor = false;
    // Front sensor
    this.fSensor = new Array();
    // Back sensor
    this.bSensor = new Array();
    // Left front sensor
    this.lfSensor = new Array();
    // Left back sensor
    this.lbSensor = new Array();
    // Right front sensor
    this.rfSensor = new Array();
    // Right back sensor
    this.rbSensor = new Array();
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
  get leftSensor() {
    return this._lSensor;
  }
  get rightSensor() {
    return this._rSensor;
  }
  get frontSensor() {
    return this._fSensor;
  }
  get backSensor() {
    return this._bSensor;
  }
  get leftFrontSensor() {
    return this._lfSensor;
  }
  get leftBackSensor() {
    return this._lbSensor;
  }
  get rightFrontSensor() {
    return this._rfSensor;
  }
  get rightBackSensor() {
    return this._rbSensor;
  }
  get shouldChangeLane() {
    return this._shouldChangeLane;
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
  set leftSensor(value) {
    this._lSensor = value;
  }
  set rightSensor(value) {
    this._rSensor = value;
  }
  set frontSensor(value) {
    this._fSensor.push(value);
  }
  set backSensor(value) {
    this._bSensor.push(value);
  }
  set leftFrontSensor(value) {
    this._lfSensor.push(value);
  }
  set leftBackSensor(value) {
    this._lbSensor.push(value);
  }
  set rightFrontSensor(value) {
    this._rfSensor.push(value);
  }
  set rightBackSensor(value) {
    this._rbSensor.push(value);
  }
  set shouldChangeLane(value) {
    this._shouldChangeLane = (value);
  }
}
