const axios = require('axios');

/**
 * Returns the height in meters for a point indicated by a latitude and longitude
 * @async
 * @param {float} lat - Latitude for point of height needed
 * @param {float} long - Longitude for point of height needed
 */
function heightCall(lat, long) {
	return new Promise((reject, resolve) => {
		axios({
			method: 'get',
			url: `https://api.open-elevation.com/api/v1/lookup\?locations\=${lat},${long}`,
			headers: {
						
			},
			data: {
						
			}
		})
			.then((res) => {
				const elevation = res.results[0];
				resolve(elevation);
			})
			.catch(err => reject(console.log(err)));
	});
}

/**
 * Returns a JSobject of information about weather at a specified location
 * @async
 * @param {float} lat - latitude of weather area
 * @param {float} long - longitude of weather area
 * @returns {JSObject} = A JSObject of info about weather
 */
function weatherCall(lat, long) {
	return new Promise((resolve, reject) => {

		axios({
			method: 'get',
			url: 'https://weather.cit.api.here.com/weather/1.0/report.json',
			data: {
				product: 'observation',
				latitude: lat,
				longitude:  long,
				oneobservation: 'true',
				app_id: 'hF9FhuQZC0D6ix1haZeZ',
				app_code: 'sc3s5Gr4xLP1v3d2uRsciQ' 
			}
		})
			.then((weather) => {
				const weatherReport = {
					"precipitation1H": weather.observations.location.obervation.precipitation1H,
					"precipitation3H": weather.observations.location.obervation.precipitation3H,
					"precipitation6H": weather.observations.location.obervation.precipitation6H,
					"precipitation12H": weather.observations.location.obervation.precipitation12H,
					"precipitation24H": weather.observations.location.obervation.precipitation24H,
					"windSpeed": weather.observations.location.obervation.windSpeed,
					"windDirection": weather.observations.location.obervation.windDirection,
					"windDescShort": weather.observations.location.obervation.windDescShort
				}
	
				resolve(weatherReport);
	
			})
			.catch(err => reject(console.log(err)));
	});
}

/**
 * Returns a JSON object containing all flights within bounded area
 * @async
 * @param {float} latMin 
 * @param {float} longMin 
 * @param {float} latMax 
 * @param {float} longMax 
 * @returns {JSON}	
 */
function airspaceCall(latMin, longMin, latMax, longMax) {
	return new Promise((reject, resolve) => {

		axios({
			method: 'get',
			url: `https://opensky-network.org/api/states/all?lamin=${latMin}&lomin=${longMin}&lamax=${latMax}&lomax=${longMax}`
		})
			.then((flights) => {
				resolve(flights.states);
			})
			.catch(err => reject(console.log(err)));
	});
	

}

module.exports = {

	apiCall(apiName, lat1, long1, lat2, long2) {
		if(apiName === "height"){
			return heightCall(lat1, long1);
		}
		else if (apiName === "weather") {
			return weatherCall(lat1, long1);
		}
		else if (apiName === "airspace") {
			return airspaceCall(lat1, long1, lat2, long2);
		}
		else {
			return null;
		}
	}

}