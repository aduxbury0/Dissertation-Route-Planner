const express = require('express');
const matrix = require('./modules/matrixCreate');

const app = express();

const start = {lng: 51.976300,lat: -0.229990}
const end = {lng: 51.899840, lat: -0.202580}

console.log(matrix.createMatrix(start, end));


app.get('/', (req, res) => {
	res.send(200);
});

const PORT = process.env.port || 8000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));