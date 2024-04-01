const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes');

const app = express();
app.use(bodyParser.json());

// Use routes defined in routes.js
app.use('/', routes);

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Fluxcart server is running on port ${PORT}`);
});
