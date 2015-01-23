/*
 * (C) 2015 Seth Lakowske
 */

var wgs84 = require('wgs84');

/*
 * Converts an angle in radians to degrees.
 */
function degrees(angle) {
    return angle * (180 / Math.PI);
}

/*
 * Converts an angle in degrees to radians.
 */
function radians(angle) {
    return angle * (Math.PI / 180);
}

/*
 * A projector that converts GPS->ECEF and ECEF->GPS
 *
 * Formulas from this paper:
 * Datum Transformations of GPS Positions
 * Application Note
 * 5th July 1999
 */
function ECEFProjector() {
    this.a = wgs84.RADIUS;
    this.f = wgs84.FLATTENING;
    this.b = wgs84.POLAR_RADIUS;
    this.asqr = this.a*this.a
    this.bsqr = this.b*this.b

    this.e = Math.sqrt((this.asqr-this.bsqr)/this.asqr)
    this.eprime = Math.sqrt((this.asqr-this.bsqr)/this.bsqr)
}

/*
 * Convert GPS coordinates (degrees) to Cartesian coordinates (meters)
 */
ECEFProjector.prototype.project = function(latitude, longitude, altitude) {
    return this.LLAToECEF(radians(latitude), radians(longitude), altitude)
}

/*
 * Convert Cartesian coordinates (meters) to GPS coordinates (degrees)
 */
ECEFProjector.prototype.unproject = function(x, y, z) {
    var gps = this.ECEFToLLA(x, y, z)

    gps[0] = degrees(gps[0]);
    gps[1] = degrees(gps[1]);

    return gps;
}

ECEFProjector.prototype.LLAToECEF = function(latitude, longitude, altitude) {
    //Auxiliary values first
    var N = this.N(latitude)
    var ratio = (this.bsqr / this.asqr)

    //Now calculate the Cartesian coordinates
    var X = (N + altitude) * Math.cos(latitude) * Math.cos(longitude)
    var Y = (N + altitude) * Math.cos(latitude) * Math.sin(longitude)

    //Sine of latitude looks right here
    var Z = (ratio * N + altitude) * Math.sin(latitude)

    return [X, Y, Z];
}

ECEFProjector.prototype.ECEFToLLA =  function(X, Y, Z) {
    //Auxiliary values first
    var p = Math.sqrt(X*X + Y*Y)
    var theta = Math.atan((Z*this.a)/(p*this.b))
    var sintheta = Math.sin(theta)
    var costheta = Math.cos(theta)
    var num = Z + this.eprime * this.eprime * this.b * sintheta * sintheta * sintheta
    var denom = p - this.e * this.e * this.a * costheta * costheta * costheta

    //Now calculate LLA
    var latitude  = Math.atan(num/denom)
    var longitude = Math.atan(Y/X)
    var N = this.N(latitude)
    var altitude  = (p / Math.cos(latitude)) - N

    return [latitude, longitude, altitude]
}

ECEFProjector.prototype.N = function(latitude) {
    var sinlatitude = Math.sin(latitude)
    var denom = Math.sqrt(1-this.e*this.e*sinlatitude*sinlatitude)
    var N = this.a / denom
    return N
}

module.exports = ECEFProjector;
