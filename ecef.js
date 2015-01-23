var projector = require('./')

var xyz = projector.project(37.8043722, -122.2708026, 0.0);
console.log(xyz);
var gps = projector.unproject(xyz[0], xyz[1], xyz[2]);
console.log(gps);
