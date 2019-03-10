//Matrix Creation Module, includes math functions.

/**
 * Converts Degrees into radians
 * @param {float} input - converts input floating point number into a radian
 * @returns {float} - the converted radians
 */

function radians(input) {
	
	return input * Math.PI / 180;

}

/**
* Calculates the distance in meters between a start and end set of WGS 84 Co-ordinates
* Sourced from "https://stackoverflow.com/questions/1502590/calculate-distance-between-two-points-in-google-maps-v3"
* @param {JSObject} start - contains lat and long attributes
* @param {JSObject} end - contains lat and long attributes
* @returns {float} - Distance in meters
*/
function haversine(start, end) {

	const R = 6378137; // Earth’s mean radius in meters

	const dLat = radians(end.lat - start.lat);
	const dLong = radians(end.lng - start.lng);

	const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(radians(start.lat)) * Math.cos(radians(end.lat)) * Math.sin(dLong / 2) * Math.sin(dLong / 2);

	const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

	const d = R * c;

	return d; // returns the distance in meters
}

/**
 * Calculates the lat/long of a point using a start point, bearing, and distance traveled.
 * @param {JSObject} start - in the format {lat: n, lng: n} - denotes the starting location for the formula 
 * @param {float} bearing - the bearing clockwise from north
 * @param {float} distance - the distance in meters
 * @returns {JSObject} - object containing the resultant lat/long pair in format {lat: n, lng: n}
 */
function getDestination(start, bearing, distance) {
	
	const R = 6378137; // Earth’s mean radius in meters
	
	const endLat = Math.asin( Math.sin(start.lat)*Math.cos(distance/R) + Math.cos(start.lat)*Math.sin(distance/R)*Math.cos(bearing) );
	const endlng = start.lng + Math.atan2(Math.sin(bearing)*Math.sin(distance/R)*Math.cos(start.lat), Math.cos(distance/R)-Math.sin(start.lat)*Math.sin(endLat));
	
	const endPoint = {
		lat: endLat,
		lng: endlng
	}
	return endPoint ;
}

/**
 * 
 * @param {JSObject} start - javascript object ing format {lat: n, lng: n} which denotes the starting location for the bearing calculation
 * @param {JSObject} end - Javascript object in format {lat: n, lng: n} which denotes the finishing location for the bearing calculation
 * @returns {float} - the resultant bearing
 */
function getBearing(start, end) {
	
	const R = 6378137; // Earth’s mean radius in meters

	const x = (end.lng-start.lng) * Math.cos((start.lat+end.lat)/2);
	const y = (end.lat-start.lat);
	const bearing = Math.sqrt(x*x + y*y) * R;
	return bearing
}

module.exports = {

	createMatrix(startSet, endSet) {

		const distance = haversine(startSet, endSet);
		const bearing = getBearing(startSet, endSet);
		const endPointComputed = getDestination(startSet, bearing, distance);

		const set = {
			start: startSet,
			end: endSet,
			distance: distance,
			bearing: bearing,
			endPointComputed: endPointComputed
		}
		return set;

	}

}