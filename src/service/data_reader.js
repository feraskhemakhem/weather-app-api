const fs = require('fs');
const readline = require('readline');
const path = require('path');

/**
 * reads data from json files based on station ID and returns data for that station
 * @param {string} stationId - station ID to look up in database
 * @param {string} date - optional date parameter to filter data by date
 * @param {object} res - Express response object
 */
function readData(stationId, date, res)
{ 
    const filePath = path.join(__dirname, `../../data/database/${stationId}.json`);

    fs.readFile(filePath, 'utf8', function(err, data)
    {
        if (err) {
            res.status(500).json({ error: 'Error reading data for station ID ' + stationId });
        }
        else {
            // only give entires with specified date if date query parameter is provided
            if (date) {
                const jsonData = JSON.parse(data);
                const filteredData = jsonData.filter(entry => entry.date === date);
                res.json(filteredData);
                console.log(`Data read complete for station ID ${stationId} with date filter ${date}`);
            }  else {
                res.json(JSON.parse(data));
                console.log(`Data read complete for station ID ${stationId}`);
            }
        }
        
    });

}

module.exports = { readData };