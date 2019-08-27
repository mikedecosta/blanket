'use strict';

const express = require('express');
const geocoder = require('./geocoder');

const app = express();
app.use(express.json());

app.get('/', (request, response) => {
  response.status(200).send('Hello, local world!');
});

app.post('/locations', (request, response) => {
    if(!request.body.locations || request.body.locations.length < 2) {
        return response.status(400).send('`locations` endpoint requires `locations` data array size to be greater than 1');
    }

    geocoder.batchGeocode(request.body.locations).then(function(geocodedLocations) {
        const usableLocations = geocodedLocations.filter(geocoder.isAddressGeocoded);

        const apiResults = {
            accepted: [],
            rejected: geocodedLocations.length - usableLocations.length
        };

        for(let i=0;i<usableLocations.length;i++) {
            let target = usableLocations[i];
            let { closestPoint, distance } = geocoder.getClosestPoint(target, usableLocations);
            if(!closestPoint) {
                throw new Error(`No closest point detected for ${target.value[0].formattedAddress}`);
            }

            apiResults.accepted.push({
                'target': target.value[0].formattedAddress,
                'closestPoint': closestPoint.value[0].formattedAddress,
                distance
            });
        }
        response.end(JSON.stringify(apiResults));
    });
});

if (module === require.main) {
  const server = app.listen(process.env.PORT || 8080, () => {
    const port = server.address().port;
    console.log(`App listening on port ${port}`);
  });
}

module.exports = app;
