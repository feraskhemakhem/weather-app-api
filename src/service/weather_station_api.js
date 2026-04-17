const { readZipFile } = require('./data_ingestor');
const { readData } = require('./data_reader');
const path = require('path');
const data_location = path.join(__dirname, '../../data/2024.csv.gz');

/**
 * Initializes the API by loading data into the database and setting up routes for requests
 * @param {object} app - Express app instance to set up routes for API
 * Note: In a production environment, data loading would likely be handled separately from API initialization
 */
async function initDatabase(app)
{
    // load data
    console.log('Loading data into database...');
    await readZipFile(data_location);
    console.log('Data loaded successfully into database...');

    // spin up api route
    app.get('/api/weather-station-data/:id', async (req, res) => {
        // home.html is base starting point
        const { id } = req.params;
        const date = req.query.date || null; // optional query parameter for date filtering
        // use id and date to access data
        readData(id, date, res);
    });
}

// routes to export to app for api requests given an ID
module.exports = { initDatabase };