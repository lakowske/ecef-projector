/*
 * (C) 2015 Seth Lakowske
 */

var test = require('tape');
var wgs84 = require('wgs84');
var ecefProjector = require('./');


test('can project the prime meridian equator intersection and unproject', function(t) {

    var coord = ecefProjector.project(0.0, 0.0, 0.0);
    console.log(coord);
    var gps = ecefProjector.unproject(coord[0], coord[1], coord[2]);

    t.deepEqual(gps, [0.0, 0.0, 0.0]);
    t.end();

})

test('works at 90 degrees latitude and 90 degrees longitude ', function(t) {

    var coord = ecefProjector.project(0.0, 90.0, 0.0);
    var gps= ecefProjector.unproject(coord[0], coord[1], coord[2]);

    t.deepEqual(gps, [0.0, 90.0, 0.0]);


    //Let's show -90 degrees longitude works
    coord = ecefProjector.project(0.0, -90.0, 0.0)
    gps = ecefProjector.unproject(coord[0], coord[1], coord[2]);

    t.deepEqual(gps, [0.0, -90.0, 0.0]);

    t.end();
})

test('works at sun prairie', function(t) {
    //Show some random point can be projected and unprojected
    var coord = ecefProjector.project(43.129001, -89.253428, 0.0)
    var gps = ecefProjector.unproject(coord[0], coord[1], coord[2]);

    t.ok(approxVector(gps, [43.129001, -89.253428, 0], 1E-9), 'Sun Prairie, WI');
    t.end();
})

test('eight quadrants', function(t) {

    var coord = ecefProjector.project(45, 45, 0)
    var gps = ecefProjector.unproject(coord[0], coord[1], coord[2]);

    t.ok(approxVector(gps, [45, 45, 0], 1E-9), 'north-ew');

    var coord = ecefProjector.project(-45, 45, 0)
    var gps = ecefProjector.unproject(coord[0], coord[1], coord[2]);

    t.ok(approxVector(gps, [-45, 45, 0], 1E-9), 'south-ew');

    var coord = ecefProjector.project(45, 135, 0)
    var gps = ecefProjector.unproject(coord[0], coord[1], coord[2]);

    t.ok(approxVector(gps, [45, 135, 0], 1E-9), 'north-ee');

    var coord = ecefProjector.project(-45, 135, 0)
    var gps = ecefProjector.unproject(coord[0], coord[1], coord[2]);

    t.ok(approxVector(gps, [-45, 135, 0], 1E-9), 'south-ee');

    var coord = ecefProjector.project(45, -45, 0)
    var gps = ecefProjector.unproject(coord[0], coord[1], coord[2]);

    t.ok(approxVector(gps, [45, -45, 0], 1E-9), 'north-we');

    var coord = ecefProjector.project(-45, -45, 0)
    var gps = ecefProjector.unproject(coord[0], coord[1], coord[2]);

    t.ok(approxVector(gps, [-45, -45, 0], 1E-9), 'south-we');

    var coord = ecefProjector.project(45, -135, 0)
    var gps = ecefProjector.unproject(coord[0], coord[1], coord[2]);


    t.ok(approxVector(gps, [45, -135, 0], 1E-9), 'north-ww');

    var coord = ecefProjector.project(-45, -135, 0)
    var gps = ecefProjector.unproject(coord[0], coord[1], coord[2]);

    t.ok(approxVector(gps, [-45, -135, 0], 1E-9), 'south-ww');

    t.end();
})

test('major meridians', function(t) {

    var coord = ecefProjector.project(45, -90, 0)
    var gps = ecefProjector.unproject(coord[0], coord[1], coord[2]);

    t.ok(approxVector(gps, [45, -90, 0], 1E-9), 'north-90');

    var coord = ecefProjector.project(-45, -90, 0)
    var gps = ecefProjector.unproject(coord[0], coord[1], coord[2]);

    t.ok(approxVector(gps, [-45, -90, 0], 1E-9), 'south-90');

    var coord = ecefProjector.project(45, 90, 0)
    var gps = ecefProjector.unproject(coord[0], coord[1], coord[2]);

    t.ok(approxVector(gps, [45, 90, 0], 1E-9), 'north+90');

    var coord = ecefProjector.project(-45, 90, 0)
    var gps = ecefProjector.unproject(coord[0], coord[1], coord[2]);

    t.ok(approxVector(gps, [-45, 90, 0], 1E-9), 'south+90');

    var coord = ecefProjector.project(45, 180, 0)
    var gps = ecefProjector.unproject(coord[0], coord[1], coord[2]);

    t.ok(approxVector(gps, [45, 180, 0], 1E-9), 'north+180');

    var coord = ecefProjector.project(-45, 180, 0)
    var gps = ecefProjector.unproject(coord[0], coord[1], coord[2]);

    t.ok(approxVector(gps, [-45, 180, 0], 1E-9), 'south+180');

    var coord = ecefProjector.project(45, -180, 0)
    var gps = ecefProjector.unproject(coord[0], coord[1], coord[2]);

    t.ok(approxVector(gps, [45, -180, 0], 1E-9), 'north-180');

    var coord = ecefProjector.project(-45, -180, 0)
    var gps = ecefProjector.unproject(coord[0], coord[1], coord[2]);

    t.ok(approxVector(gps, [-45, -180, 0], 1E-9), 'south-180');

    t.end();

})

//tests taken from geodetic-to-ecef

test('oakland', function (t) {
    t.deepEqual(
        ecefProjector.project(37.8043722, -122.2708026, 0.0),
        [ -2694044.411163704, -4266368.805505009, 3888310.602231939 ],
        'sea level'
    );
    t.deepEqual(
        ecefProjector.project(37.8043722, -122.2708026, 300000),
        [ -2820601.154146036, -4466787.825380376, 4072200.8066418027 ],
        '300km up in space'
    );

    t.ok(
        approx(
            dist(ecefProjector.project(37.8043722, -122.2708026, 300000)),
            wgs84.RADIUS + 300000
        ), 'space distance'
    );
    t.ok(
        approx(
            dist(ecefProjector.project(37.8043722, -122.2708026, 0.0)),
            wgs84.RADIUS
        ), 'ground distance'
    );

    t.ok(
        approx(
            dist(ecefProjector.project(37.8043722, -122.2708026, -4000)),
            wgs84.RADIUS - 4000
        ), 'underground distance'
    );

    t.end();
});

function approx (a, b) {
    return (a - b) / ((a + b) / 2) < 0.01;
}

function dist (xyz) {
    var x = xyz[0], y = xyz[1], z = xyz[2];
    return Math.sqrt(x*x + y*y + z*z);
}

function approxVector(a, b, delta) {
    for (var i = 0 ; i < a.length ; i++) {
        if (Math.abs(a[i] - b[i]) > delta) {
            return false;
        }
    }
    return true;
}
