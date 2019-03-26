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
	
	console.log(set);
	res.send(set);

	// objectCre.createObjectMatrix(set)
	// 	.then((set) => {
			
	// 		//set = graphCre.createGraph(set);
	// 		res.send(200, set);
		
	// 	})
	// 	.catch(err => res.send(500, err));



});

app.get('/test', (req, res) => {
	
	// apis.heightCall(27.988101, 86.924894)
	// 	.then((response) => {
	// 		res.send(200, response);
	// 	})
	// 	.catch(err => console.log(err));

	// apis.weatherCall(-0.229991,51.976301)
	// 	.then(response => {
	// 		res.send(200, response);
	// 	})
	// 	.catch(err => console.log(err));
	
	

});

const PORT = process.env.port || 8000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));