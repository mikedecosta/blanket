'use strict';

const APPCONFIG = require('./app-config');
const nodeGeocoder = require('node-geocoder');

const DISTANCE_UNIT = "miles";
const geocoder = nodeGeocoder({
    provider: 'google',
    apiKey: APPCONFIG.GOOGLE_API_KEY
});

module.exports.batchGeocode = function (locations) {
    return geocoder.batchGeocode(locations, function(error, results) {
        if(error) {
            throw new Error('Request Error: ', error);
        }

        return results;
    });
}

module.exports.getClosestPoint = function (target, locations) {
    if(target.error) {
        return null;
    }

    let closestPoint;
    let closestPointDistance;
    for(let i=0;i<locations.length;i++) {
        const loc = locations[i];
        if (loc.value[0].formattedAddress === target.value[0].formattedAddress) {
            continue;
        }

        const distance = calculateDistance(target.value[0], loc.value[0], DISTANCE_UNIT);
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

module.exports.isAddressGeocoded = function(address) {
    return !address.error && address.value && address.value.length
}

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

    if (unit==="km") { distance = dist * 1.609344 }

    return distance;
}

