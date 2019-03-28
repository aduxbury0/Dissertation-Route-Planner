const express = require('express');
const matrix = require('./modules/matrixCreate');
const objectCre = require('./modules/objectCreation');
const graphCre = require('./modules/graphCreation');
const apis = require('./modules/apiRequests');

const app = express();

app.get('/',(req, res) => {
	
	const start = {lat: 51.976301,lng: -0.229991}
	const end = {lat: 51.947952, lng: -0.277250}
	const cieling = 4000;

	let set = matrix.createMatrix(start, end, cieling);
	objectCre.createObjectMatrix(set)
		.then(newSet => {
			set = newSet;
			set = graphCre.createGraph(set);
			res.status(200).send(set);
		})
		.catch(err => console.log(err));
});

app.get('/test', (req, res) => {
	
	const start = {lat: 51.976301,lng: -0.229991}
	//const end = {lat: 51.947952, lng: -0.277250}

	// const result = matrix.getDestTest(start, 180, 1);
	apis.heightCall(start.lat, start.lng)
		.then(result => {
			res.status(200).send({elevation: result})

		})
		.catch(err => console.log(err));
	
});

const PORT = process.env.port || 8000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));