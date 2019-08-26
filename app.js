'use strict';

const APPCONFIG = require('./app-config');
const express = require('express');
const nodeGeocoder = require('node-geocoder');

const app = express();
app.use(express.json());

const DISTANCE_UNIT = "miles";
const geocoder = nodeGeocoder({
    provider: 'google',
    apiKey: APPCONFIG.GOOGLE_API_KEY
});

app.get('/', (request, response) => {
  response.status(200).send('Hello, local world!');
});

app.post('/locations', (request, response) => {
    if(!request.body.locations || request.body.locations.size <= 0) {
        throw new Error('request requires "locations" array not to be empty');
    }

    geocoder.batchGeocode(request.body.locations, function(error, results) {
        if(error) {
            throw new Error('Request Error: ', error);
        }
        const apiResults = {
            accepted: [],
            rejected: []
        };
        for(let i=0;i<results.length;i++) {
            let target = results[i];
            if(target.error) {
                apiResults.rejected.push(target);
                continue;
            }

            let { closestPoint, distance } = getClosestPoint(target, results);
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

function calculateDistance(locationA, locationB, unit) {
    const radiusLatitudeA = Math.PI * locationA.latitude/180;
    const radiusLatitudeB = Math.PI * locationB.latitude/180;
    const theta = locationA.longitude - locationB.longitude;
    const radiusTheta = Math.PI * theta/180;

    let distance = Math.sin(radiusLatitudeA) * Math.sin(radiusLatitudeB) + Math.cos(radiusLatitudeA) * Math.cos(radiusLatitudeB) * Math.cos(radiusTheta);
    if (distance > 1) {
        distance = 1;
    }

    distance = Math.acos(distance);
    distance = distance * 180/Math.PI;
    distance = distance * 60 * 1.1515;

    if (unit=="km") { distance = dist * 1.609344 }

    return distance;
}

function getClosestPoint(target, locations) {
    if(target.error) {
        return null;
    }

    let closestPoint;
    let closestPointDistance;
    for(let i=0;i<locations.length;i++) {
        let loc = locations[i];
        if (loc.error || loc.value[0].formattedAddress === target.value[0].formattedAddress) {
            continue;
        }

        let distance = calculateDistance(target.value[0], loc.value[0], DISTANCE_UNIT);
        if(!closestPoint || distance < closestPointDistance) {
            closestPoint = loc;
            closestPointDistance = distance;
        }
    }

    return { 
        'closestPoint': closestPoint, 
        'distance': Math.round(closestPointDistance) + " " + DISTANCE_UNIT
    };
}

if (module === require.main) {
  const server = app.listen(process.env.PORT || 8080, () => {
    const port = server.address().port;
    console.log(`App listening on port ${port}`);
  });
}

module.exports = app;
