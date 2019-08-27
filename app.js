'use strict';

const express = require('express');
const geocoder = require('./geocoder');

const app = express();
app.use(express.json());

app.get('/', (request, response) => {
  response.status(200).send('Hello, local world!');
});

app.post('/locations', (request, response) => {
    if(!request.body.locations || request.body.locations.size <= 0) {
        throw new Error('request requires "locations" array not to be empty');
    }

    geocoder.batchGeocode(request.body.locations).then(function(geocodedLocations) {

        const apiResults = {
            accepted: [],
            rejected: []
        };
        for(let i=0;i<geocodedLocations.length;i++) {
            let target = geocodedLocations[i];
            if(target.error) {
                apiResults.rejected.push(target);
                continue;
            }

            let { closestPoint, distance } = geocoder.getClosestPoint(target, geocodedLocations);
            if(!closestPoint) {
                apiResults.rejected.push(target.value[0].formattedAddress);
                continue;
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
