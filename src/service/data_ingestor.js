const fs = require('fs');
const unzipper = require('unzipper');
const readline = require('node:readline/promises');
const path = require('path');
const databaseDir = path.join(__dirname, '../../data/database');

// ref: https://medium.com/@harrietty/zipping-and-unzipping-files-with-nodejs-375d2750c5e4
/**
 * reads a zip file and writes the contents to json files based on ID
 * @param {string} filePath - zip file path
 */
async function readZipFile(data_location) {
    
    // create database folder if data isn't already read in
    try {
        if (!fs.existsSync(databaseDir)) {
            fs.mkdirSync(databaseDir);
        }
        else {
            console.log('Database already created');
            return;
        }
    } catch (err) {
        console.error('Error creating database directory:', err);
        return;
    }

    const zipContents = fs.createReadStream(data_location).pipe(unzipper.Parse({ forceStream: true }));
    
    // should run once for single file in zip, but can run for multiple files if needed
    for await (const fileContents of zipContents) {

        // read each line of the file
        // ref: https://stackoverflow.com/questions/6156501/read-a-file-one-line-at-a-time-in-node-js
        const rl = readline.createInterface({
            input: fileContents,
            crlfDelay: Infinity // readline will emit 'line' event for each line of the file
        });

        // basic error checking
        rl.on('error', (err) => {
            console.error('Error reading file:', err);
            fs.rmSync(databaseDir, { recursive: true, force: true }); // clean up database directory if error occurs
            return;
        });

        // for each line, parse the data and write to appropriate output file
        for await (const line of rl)
        {
            writeToJson(line);
        }

        // once all files are completed, close their parenthesis to create valid json arrays
        fs.readdir(databaseDir, (err, files) => {
            if (err) {
                console.error('Error reading database directory:', err);
                return;
            }
            files.forEach(file => {
                const filePath = path.join(databaseDir, file);
                fs.appendFileSync(filePath, "]", (err) => {
                    if (err) {
                        console.error('Error appending to JSON file:', err);
                    }
                });
            });
        });
        }
}

/**
 * [HELPER] writes a data point to respective json file based on ID
 * @param {string} dataPoint - a line of data containing ID, YYYYMMDD, etc
 */
function writeToJson(dataPoint) {

    // parse data and write to json file
    const parsedDataPoint = dataPoint.split(",");

    // data divided - ID, YYYYMMDD, ELEMENT, DATA VALUE, M-FLAG, Q-FLAG, S-FLAG, OBS-TIME
    const id = parsedDataPoint[0];
    const date = parsedDataPoint[1];
    const element = parsedDataPoint[2];
    const dataValue = parsedDataPoint[3];
    const mFlag = parsedDataPoint[4];
    const qFlag = parsedDataPoint[5];
    const sFlag = parsedDataPoint[6];
    const obsTime = parsedDataPoint[7];
    
    // create json object to write to file
    const jsonObject = {
        "date": date,
        "element": element,
        "dataValue": dataValue,
        "mFlag": mFlag,
        "qFlag": qFlag,
        "sFlag": sFlag,
        "obsTime": obsTime
    };

    // write to json file
    try {
        const jsonString = JSON.stringify(jsonObject);
        // if new file, add opening bracket to start json array
        if (!fs.existsSync(`${databaseDir}/${id}.json`)) {
            fs.writeFileSync(`${databaseDir}/${id}.json`, "[" + jsonString, { flag: 'w' }); // create new file and write opening bracket for json array
        }
        // if file already exists, append jsonString to end of file with delimiter
        else {
            fs.appendFileSync(`${databaseDir}/${id}.json`, "," + jsonString); // append to file if it already exists
        }
    } catch (err) {
        console.error('Error writing to JSON file:', err);
    }
}

// export functionality
module.exports = { readZipFile };