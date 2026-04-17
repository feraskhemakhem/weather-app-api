// boilerplate express setup
const express = require('express');
const { readFile } = require('fs').promises;
const { initAPI, initDatabase } = require('../service/weather_station_api'); // import initAPI function to load data before accepting requests
const app = express();
const port = 8080;

app.use(express.json()); // middleware to parse JSON bodies

initDatabase(app); // load data into database and start accepting API requests

app.get('/', async (req, res) => {
  // home.html is base starting point
  res.send( await readFile('./src/frontend/home.html', 'utf-8') );
});

// tell express to listen for port
app.listen(port, () => {
  console.log(`API listening at http://localhost:${port}`);
});


