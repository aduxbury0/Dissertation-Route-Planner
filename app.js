const express = require('express');
const controller = require('./modules/controller');

const graphCre = require('./modules/graphCreation');
const dijkstra = require('./modules/dijkstra');
const currentTest = require('./TestRoutes/500.json');

const fs = require('fs');

const app = express();

app.get('/',(req, res) => {
	
	res.sendStatus(200);

});

app.get('/findroute', (req, res) => {
	
	let start = new Date();
	controller.routeFinder(req)
		.then(body => {
			let end = new Date();
			console.log(end - start);
			res.send(body);
		})
		.catch(err => console.log(err));

});

app.get('/test', (req,res) => {

	let set = {
		start: 0,
		end: 0,
		distance: 0,
		distanceToFinal: 0,
		bearing: 0,
		ceiling: 4000,
		array: [],
		objMatrix: currentTest.Objects,
		adjMatrix: [],
		shortestPath: []
	}

	let results = {}
	for(let i = 0; i < 10; i++){
		set = graphCre.createGraph(set);
		set = dijkstra.findPath(set);

		const result = {
			"adjacencyMatrix": set.adjMatrix,
			"shortestPath": set.shortestPath,
			"ceiling": set.ceiling,
			"routeLength": set.shortestPath.length
		}

		results['result ' + (i+1)] = result
	}

	fs.writeFile('./Test Results/Theoretical/500.json', JSON.stringify(results), 'utf8', () => {
		res.sendStatus(200);
	});
	
});

const PORT = process.env.port || 8000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));