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
* @param {Object} start - contains lat and long attributes
* @param {Object} end - contains lat and long attributes
* @returns {float} - Distance in meters
*/
function haversine(start, end) {

	const R = 6378137; // Earth’s mean radius in meters

	const dLat = radians(end.lat - start.lat);
	const dLong = radians(end.lng - start.lng);

	const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(radians(start.lat)) * Math.cos(radians(end.lat)) * Math.sin(dLong / 2) * Math.sin(dLong / 2);

	const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

	const distance = R * c;

	return distance.toFixed(2);
}

/**
 * Calculates the lat/long of a point using a start point, bearing, and distance traveled.
 * @param {Object} start - in the format {lat: n, lng: n} - denotes the starting location for the formula 
 * @param {float} bearing - the bearing clockwise from north
 * @param {float} distance - the distance in meters
 * @returns {Object} - object containing the resultant lat/long pair in format {lat: n, lng: n}
 */
function getDestination(start, bearing, distance) {
	
	const R = 6378137; // Earth’s mean radius in meters

	const endLat = Math.asin( Math.sin(start.lat)*Math.cos(distance/R) + Math.cos(start.lat)*Math.sin(distance/R)*Math.cos(bearing));

	const endLng = start.lng + Math.atan2(Math.sin(bearing)*Math.sin(distance/R)*Math.cos(start.lat), Math.cos(distance/R)-Math.sin(start.lat)*Math.sin(endLat));

	const endPoint = {
		lat: endLat,
		lng: endLng
	}
	return endPoint ;
}

/**
 * 
 * @param {Object} start - javascript object ing format {lat: n, lng: n} which denotes the starting location for the bearing calculation
 * @param {Object} end - Javascript object in format {lat: n, lng: n} which denotes the finishing location for the bearing calculation
 * @returns {float} - the resultant bearing
 */
function getBearing(start, end) {
	
	const y = Math.sin(end.lng-start.lng) * Math.cos(end.lat);
	const x = Math.cos(start.lat)*Math.sin(end.lat) - Math.sin(start.lat)*Math.cos(end.lat)*Math.cos(end.lng-start.lng);
	const radianBearing = Math.atan2(y, x);
	let bearing = radianBearing * (180/Math.PI);

	if(bearing < 0){
		bearing = bearing + 360;
	}

	return bearing.toFixed(2)
}

/**
 * creates a correctly sized array filled with subarrays (essentially a 2D array)
 * @param {float} distance - Distance between start and end in meters 
 * @returns {Array} - an array that is the size of the number of kms in distance + 1, filled with empty arrays of size 5 at each index
 */
function createArrays(distance) {

	const arrayNodes = Math.ceil((distance/1000) + 1);
	const mainArray = new Array(arrayNodes);

	for(let i = 0; i < mainArray.length; i++) {
		mainArray[i] = new Array(0, 0 ,0, 0 ,0);
	}

	return mainArray;
}

/**
 * Fills the main array with lat/long co-ordinates
 * @param {Object} start - Javascript object containing lat and long of start location in format {lat: x, lng: y}
 * @param {Object} end 
 * @param {Array} mainArray 
 * @param {float} bearing 
 * @returns {Array} - The filled array
 */
function populateArray(start, end, mainArray, bearing) {

	const leftBearing = (bearing + 270) % 360;
	const rightBearing = (bearing + 90) % 360;

	mainArray[0][2] = [start.lat, start.lng];
	mainArray[mainArray.length - 1][2] = [end.lat, end.lng];
	
	
	for(let i = 0; i < mainArray.length; i++) {

		const startI = {
			lat: mainArray[i][2][0],
			lng: mainArray[i][2][1]
		}
		const leftClose = getDestination(startI, leftBearing, 1000);
		const leftFar = getDestination(leftClose, leftBearing, 1000);
		const rightClose = getDestination(startI, rightBearing, 1000);
		const rightFar = getDestination(rightClose, rightBearing, 1000);

		mainArray[i][4] = [parseFloat(leftFar.lat.toFixed(6)), parseFloat(leftFar.lng.toFixed(6))];
		mainArray[i][3] = [parseFloat(leftClose.lat.toFixed(6)), parseFloat(leftClose.lng.toFixed(6))];
		mainArray[i][1] = [parseFloat(rightClose.lat.toFixed(6)), parseFloat(rightClose.lng.toFixed(6))];
		mainArray[i][0] = [parseFloat(rightFar.lat.toFixed(6)), parseFloat(rightFar.lng.toFixed(6))];

		//case for all nodes besides ones in final array
		if(i !== mainArray.length - 1) {

			const currentLocation = {
				lat: mainArray[i][2][0],
				lng: mainArray[i][2][1]
			}
			const nextCenter = getDestination(currentLocation, bearing, 1000);
			let nextLat = nextCenter.lat;
			let nextLng = nextCenter.lng;
			nextLat = parseFloat(nextLat.toFixed(6));
			nextLng = parseFloat(nextLng.toFixed(6));
			mainArray[i+1][2] = [nextLat, nextLng];
		}
	}
	//console.log(mainArray);
	return mainArray;

}

module.exports = {

	/**
	 * Takes the initial start and finish locations for the route and creates the initial matrix of lat/lngs and other important metadata
	 * @param {Object} start - Object containing lat and lng elements which represent the latitude and longitude of the start location
	 * @param {Object} end - Object containing lat and lng elements which represent the latitude and longitude of the end location
	 * @returns {Object} - Returns the initial data set for the route
	 */
	createMatrix(start, end) {

		const distance = haversine(start, end);

		const bearing = getBearing(start, end);

		const unfilledArray = createArrays(distance);

		const populatedArray = populateArray(start, end, unfilledArray, bearing);

		const distanceToFinal = (Math.ceil((distance % 1000) * 100) / 100);

		const set = {
			start: start,
			end: end,
			distance: distance,
			distanceToFinal: distanceToFinal,
			bearing: bearing,
			array: populatedArray
		}
		return set;

	}

}