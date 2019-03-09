const express = require('express');

const app = express();

app.get('/', (req, res) => {
	res.send(200);
});

const PORT = process.env.port || 8000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));