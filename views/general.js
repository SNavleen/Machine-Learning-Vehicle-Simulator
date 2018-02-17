// Input
// min: start value
// max: end value
function randInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

// Input
// a: first value
// b: second value
function max(a, b) {
  return Math.max(a, b);
}

// Input
// a: first value
// b: second value
function min(a, b) {
  return Math.min(a, b);
}

// Input
// A: is a point of an object {x: xValue, y: yValue}
// B: is a point of an object {x: xValue, y: yValue}
function slope(A, B) {
  if (A.x == B.x) {
    // Vertical line
    return undefined;
  }
  var m = (B.y - A.y) / (B.x - A.x);
  return m;
}

// Input
// A: is a point of an object {x: xValue, y: yValue}
// m: is the slope of the line
function intercept(A, m) {
  if (m === null) {
    return undefined;
  }
  // b = y - m * x
  var b = A.y - m * A.x;
  return b;
}

// Input
// a: first value
// b: second value
function difference(a, b) {
  return Math.abs(a - b);
}

module.exports = {
  randInterval,
  max,
  min,
  slope,
  intercept,
  difference
}