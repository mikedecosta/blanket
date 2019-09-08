'use strict';

const APPCONFIG = require('./../../app-config');
const nodeGeocoder = require('node-geocoder');

const DISTANCE_UNIT = 'miles';
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

        const distance = this.calculateDistance(target.value[0], loc.value[0], DISTANCE_UNIT);
        if(!closestPoint || distance < closestPointDistance) {
            closestPoint = loc;
            closestPointDistance = distance;
        }
    }

    return { 
        'closestPoint': closestPoint, 
        'distance': Math.round(closestPointDistance) + ' ' + DISTANCE_UNIT
    };
}

module.exports.isAddressGeocoded = function(address) {
    return !address.error &&
            address.hasOwnProperty('value') &&
            Array.isArray(address.value) &&
            address.value.length &&
            address.value[0].hasOwnProperty('formattedAddress') &&
            address.value[0].formattedAddress.length &&
            address.value[0].hasOwnProperty('latitude') &&
            address.value[0].hasOwnProperty('longitude')
}

module.exports.calculateDistance = function(locationA, locationB, unit) {
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

    if (unit==='km') { distance = distance * 1.609344 }

    return distance;
}

