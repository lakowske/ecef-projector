# ecef-projector

convert [geodetic coordinates](https://en.wikipedia.org/wiki/World_Geodetic_System)
([lat,lon, alt])
to [ecef](http://en.wikipedia.org/wiki/ECEF) (cartesian [x,y,z]) and [ecef](http://en.wikipedia.org/wiki/ECEF) (cartesian [x,y,z]) to 
[geodetic coordinates](https://en.wikipedia.org/wiki/World_Geodetic_System) ([lat,lon, alt])

# example

``` js
var projector = require('ecef-projector');
var xyz = projector.project(37.8043722, -122.2708026, 0.0);
console.log(xyz);
var gps = projector.unproject(xyz[0], xyz[1], xyz[2]);
console.log(gps);
```

output:

```
$ node ecef.js
[ -2694044.4111565403, -4266368.805493665, 3888310.602276871 ]
[ 37.8043722, -122.27080260000001, 0.0 ]
```

# methods

``` js
var projector = require('ecef-projector')
```

## var xyz = projector.project(lat, lon, elevation)

Return an array `xyz` of `[x,y,z]` coordinates in meters from `lat`, `lon` and `alt` where lat and lon are in degrees.

## var gps = projector.unproject(x, y, z)

Return an array of `[lat, lon, alt]` coordinates in degrees from `x`, `y`, and `z` in meters

# install

With [npm](https://npmjs.org) do:

```
npm install ecef-projector
```

# license

BSD-3


