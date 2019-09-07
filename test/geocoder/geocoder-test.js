'use strict';

const geocoder = require('../../src/geocoder/geocoder');

const geoStatueOfLiberty = {
    "error": undefined,
    "value": [{
        "formattedAddress": "Statue of Liberty National Monument, New York, NY 10004, USA",
        "latitude": 40.6892494,
        "longitude": -74.04450039999999,
        "extra": {
          "googlePlaceId": "ChIJPTacEpBQwokRKwIlDXelxkA",
          "confidence": 0.7,
          "premise": null,
          "subpremise": null,
          "neighborhood": "Manhattan",
          "establishment": "Statue of Liberty National Monument"
        },
        "administrativeLevels": {
          "level2long": "New York County",
          "level2short": "New York County",
          "level1long": "New York",
          "level1short": "NY"
        },
        "city": "New York",
        "country": "United States",
        "countryCode": "US",
        "zipcode": "10004",
        "provider": "google"
    }]
};

const geoEmpireStateBuilding = {
    "error": undefined,
    "value": [{
        "formattedAddress": "20 W 34th St, New York, NY 10001, USA",
        "latitude": 40.7484405,
        "longitude": -73.98566439999999,
        "extra": {
          "googlePlaceId": "ChIJaXQRs6lZwokRY6EFpJnhNNE",
          "confidence": 1,
          "premise": null,
          "subpremise": null,
          "neighborhood": "Manhattan",
          "establishment": null
        },
        "administrativeLevels": {
          "level2long": "New York County",
          "level2short": "New York County",
          "level1long": "New York",
          "level1short": "NY"
        },
        "streetNumber": "20",
        "streetName": "West 34th Street",
        "city": "New York",
        "country": "United States",
        "countryCode": "US",
        "zipcode": "10001",
        "provider": "google"
    }]
};



describe('geocoder', function() {
    describe('#getClosestPoint', function() {
        it('Exactly 2 locations should return each other', function() {
            const closestLocationStatue = geocoder.getClosestPoint(geoStatueOfLiberty, [geoStatueOfLiberty, geoEmpireStateBuilding]);
            const closestLocationEmpire = geocoder.getClosestPoint(geoEmpireStateBuilding, [geoStatueOfLiberty, geoEmpireStateBuilding]);

            assert.equal(closestLocationStatue.closestPoint, geoEmpireStateBuilding);
            assert.equal(closestLocationEmpire.closestPoint, geoStatueOfLiberty);

            assert.equal(closestLocationStatue.distance, closestLocationEmpire.distance);
        });
    });
});
