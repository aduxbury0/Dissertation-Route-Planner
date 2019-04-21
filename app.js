const express = require('express');
const controller = require('./modules/controller');

const app = express();

app.get('/',(req, res) => {
	
	res.sendStatus(200);

});

app.get('/findroute', (req, res) => {
	
	controller.routeFinder(req)
		.then(body => {
			res.send(body);
		})
		.catch(err => console.log(err));

	
});

const PORT = process.env.port || 8000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));