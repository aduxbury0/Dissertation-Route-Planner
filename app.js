const express = require('express');
const matrix = require('./modules/matrixCreate');
const objectCre = require('./modules/objectCreation');

const app = express();

app.get('/', (req, res) => {
	
	const start = {lng: 51.976301,lat: -0.229991}
	const end = {lng: 51.899841, lat: -0.202581}

	const set = matrix.createMatrix(start, end)
	objectCre.createObjectMatrix(set)
		.then((set) => {
			res.send(200, set);
		});
});

const PORT = process.env.port || 8000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));