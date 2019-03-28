const axios = require('axios');

module.exports = {

	/**
	 * Returns the height in meters for a point indicated by a latitude and longitude
	 * @async
	 * @param {float} lat - Latitude for point of height needed
	 * @param {float} long - Longitude for point of height needed
	 */
	heightCall(lat, long) {
		return new Promise((resolve, reject) => {
			axios({
				method: 'get',
				url: `https://elevation-api.io/api/elevation?points=${lat},${long}`

			})
				.then((res) => {
					const elevation = res.data.elevations[0].elevation;
					resolve(elevation);
				})
				.catch(err => reject(console.log(err)));
		});
	},

	/**
	 * Returns a JSobject of information about weather at a specified location
	 * @async
	 * @param {float} lat - latitude of weather area
	 * @param {float} long - longitude of weather area
	 * @returns {Object} A JSObject of info about weather
	 */
	weatherCall(lat, long) {
		return new Promise((resolve, reject) => {
			axios({
				method: 'get',
				url: `https://weather.cit.api.here.com/weather/1.0/report.json?app_id=hF9FhuQZC0D6ix1haZeZ&app_code=sc3s5Gr4xLP1v3d2uRsciQ&latitude=${lat}&longitude=${long}&oneobservation=true&product=observation`
			})
				.then((weather) => {
					//console.log(weather.data.observations.location[0].observation[0]);
					const weatherReport = {
						precipitation1H: weather.data.observations.location[0].observation[0].precipitation1H,
						precipitation3H: weather.data.observations.location[0].observation[0].precipitation3H,
						precipitation6H: weather.data.observations.location[0].observation[0].precipitation6H,
						precipitation12H: weather.data.observations.location[0].observation[0].precipitation12H,
						precipitation24H: weather.data.observations.location[0].observation[0].precipitation24H,
						windSpeed: weather.data.observations.location[0].observation[0].windSpeed,
						windDirection: weather.data.observations.location[0].observation[0].windDirection,
						windDescShort: weather.data.observations.location[0].observation[0].windDescShort,
						country: weather.data.observations.location[0].observation[0].country
					}
					resolve(weatherReport);
				})
				.catch(err => reject(console.log(err)));
		});
	},

	/**
	 * Returns a JSON object containing all flights within bounded area
	 * @async
	 * @param {float} latMin 
	 * @param {float} longMin 
	 * @param {float} latMax 
	 * @param {float} longMax 
	 * @returns {JSON}
	 */
	airspaceCall(latMin, longMin, latMax, longMax) {
		return new Promise((resolve, reject) => {

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
}
