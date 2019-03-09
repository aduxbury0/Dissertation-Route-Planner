//Matrix Creation Module, includes math functions.

/**
 * Converts Degrees into radians
 * @param {float} input - converts input floating point number into a radian
 * @returns {float} - the converted radians
 */

function rad(input) {
	
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
	const R = 6378137; // Earth’s mean radius in meter
	const dLat = rad(end.lat - start.lat);
	const dLong = rad(end.lng - start.lng);
	const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(rad(start.lat)) * Math.cos(rad(end.lat)) *
    Math.sin(dLong / 2) * Math.sin(dLong / 2);
	const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	const d = R * c;
	return d; // returns the distance in meters
}


module.exports = {

	createMatrix(startSet, endSet) {

		const distance = haversine(startSet, endSet);
		return distance;

	}

}