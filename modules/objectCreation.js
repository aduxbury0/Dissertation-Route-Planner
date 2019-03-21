const apiCalls = require('./apiRequests');

/**
 * Uses a lat long pair to call the weather call module generating an object containing data for that lat/long location
 * @param {Array} latLngPair - An array containing a latitude @ [0] and longitude @ [1]
 * @returns {Object} - A JS object containing data returned by the weather API
 */
function getWeather(latLngPair) {
	return new Promise((reject, resolve) => {

		apiCalls.weatherCall(latLngPair[0], latLngPair[1])
			.then((weatherReport) => {
				resolve(weatherReport);
			})
			.catch(err => reject(err));

	})
    
}
/**
 * Uses a lat long pair to call terrain height call module generating a float relating to the height at that lat/long location
 * @param {Array} latLngPair - an array containing a latitude @ [0] and longitude @ [1]
 * @returns {Float} - a flaot representing the terrain height at that location;
 */
function getTerrainHeight(latLngPair) {
	return new Promise((reject, resolve) => {
		apiCalls.heightCall(latLngPair[0], latLngPair[1])
			.then(height => resolve(height))
			.catch(err => reject(err));
	});
}

/**
 * Generates a single JS object that contains both height and weather data for a single location
 * @param {Array} latLngPair - an array containing a latitude @ [0] and a longitude @ [1]
 * @returns {Object} - An object with data relating to the weather and height of a single location
 */
function generateObject(latLngPair) {
	return new Promise(async (reject, resolve) => {
        
		try{
			const weatherReport = await getWeather(latLngPair);
			const terrainHeight = await getTerrainHeight(latLngPair);

			const nodeObject = {
				height: terrainHeight,
				precipitation1H: weatherReport.precipitation1H,
				precipitation3H: weatherReport.precipitation3H,
				precipitation6H: weatherReport.precipitation6H,
				precipitation12H: weatherReport.precipitation12H,
				precipitation24H: weatherReport.precipitation24H,
				windSpeed: weatherReport.windSpeed,
				windDirection: weatherReport.windDirection,
				windDescShort: weatherReport.windDescShort
			};
    
			resolve(nodeObject);
		}
        
		catch(err) {
			reject(err);
		}
	});
}

/**
 * Generates an array of length n filled with filled arrays that can be worked on
 * @param {Number} arrLength - the lenth that the top level array needs to be
 * @returns {Array} - an array of length arrLength filled with arrays containing 0,0,0,0,0
 */
function createArray(arrLength) {
	const newArray = new Array(arrLength);
	for(let i = 0; i < arrLength; i++) {
		for(let j = 0; j < 5; j++) {
			newArray[i] = [0,0,0,0,0];
		}
	}
	return newArray;
}



module.exports = {

	/**
     * Uses a set generated in Matrix Creation to generate arrays filled with objects relating to weather and height data at each specified lat/long 
     * @param {Object} set - JS Object set generated from the Matrix Creation Module
     * @returns {Object} - JS Object containing data on the route and an array of 5n objects (where N is length of the array) 
     */
	async createObjectMatrix(set) {
        return new Promise(async (reject, resolve) => {
			const coordMatrix = set.array;
			const objectMatrix = createArray(coordMatrix.length);
	
			for(let i = 0; i < coordMatrix.length; i++) {
				console.log(`Generating Objects: ${  Math.round(((i/(objectMatrix.length))*100))  }% complete`)
				for(let j = 0; j < coordMatrix[i].length; j++) {
	
					try{
						const nodeObject = await generateObject(coordMatrix[i][j]);
						objectMatrix[i][j] = nodeObject;
					}
					catch(err) {
						reject(err);
					}
	
				}
			}
			set.array = objectMatrix;
			resolve(set);
		});
	}
}