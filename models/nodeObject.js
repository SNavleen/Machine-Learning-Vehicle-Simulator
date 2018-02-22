module.exports = class nodeObject{
  constructor(nodeId, x, y){
    this.nodeId = nodeId;
    this.x = x;
    this.y = y;
    this._intersectionQueue = new Array();
  }

  get intersectionQueue() {
    return this._intersectionQueue;
  }
  addToIntersectionQueue(value) {
    this._intersectionQueue.push(value);
  }
}
