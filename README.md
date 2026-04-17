# weather-app
A weather app to request weather data via Restful API. Using Node.js and Express.

## Instructions

### Local

To prepare before running, move the gz file into the data folder (it's too large to host on GitHub)

To run the application yourself in Node, run:
`npm install`
`node .`

### Docker

If using docker, build a docker image with:
`docker build -t weather-app-api .`

Then, run the docker image:
`docker run -p 8081:8081 weather-app-api`

### Usage

To query data by station ID from the API once the application is running, run the following get request:
`localhost:8080/api/weather-station-data/{station-id}`, where {station-id} is the weather station's ID.

Dates can also be queried, as a simple form of pagination. To search queries by station ID _and_ date, run the following get request:
`localhost:8080/api/weather-station-data/{station-id}?date={date}`, where {station-id} is the weather station's ID and {date} is the date in the YYYYMMDD format.