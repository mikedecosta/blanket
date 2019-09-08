'use strict';

const geocoder = require('../../src/geocoder/geocoder');

const geoStatueOfLiberty = {
    'error': undefined,
    'value': [{
        'formattedAddress': 'Statue of Liberty National Monument, New York, NY 10004, USA',
        'latitude': 40.6892494,
        'longitude': -74.04450039999999,
        'extra': {
          'googlePlaceId': 'ChIJPTacEpBQwokRKwIlDXelxkA',
          'confidence': 0.7,
          'premise': null,
          'subpremise': null,
          'neighborhood': 'Manhattan',
          'establishment': 'Statue of Liberty National Monument'
        },
        'administrativeLevels': {
          'level2long': 'New York County',
          'level2short': 'New York County',
          'level1long': 'New York',
          'level1short': 'NY'
        },
        'city': 'New York',
        'country': 'United States',
        'countryCode': 'US',
        'zipcode': '10004',
        'provider': 'google'
    }]
};

const geoEmpireStateBuilding = {
    'error': undefined,
    'value': [{
        'formattedAddress': '20 W 34th St, New York, NY 10001, USA',
        'latitude': 40.7484405,
        'longitude': -73.98566439999999,
        'extra': {
          'googlePlaceId': 'ChIJaXQRs6lZwokRY6EFpJnhNNE',
          'confidence': 1,
          'premise': null,
          'subpremise': null,
          'neighborhood': 'Manhattan',
          'establishment': null
        },
        'administrativeLevels': {
          'level2long': 'New York County',
          'level2short': 'New York County',
          'level1long': 'New York',
          'level1short': 'NY'
        },
        'streetNumber': '20',
        'streetName': 'West 34th Street',
        'city': 'New York',
        'country': 'United States',
        'countryCode': 'US',
        'zipcode': '10001',
        'provider': 'google'
    }]
};

const geoPortAuthorityBusStation = {
    'error': undefined,
    'value': [{
        'formattedAddress': 'Port Authority Bus Station, 625 8th Ave, New York, NY 10109, USA',
        'latitude': 40.7571667,
        'longitude': -73.9908056,
        'extra': {
          'googlePlaceId': 'ChIJCU8NPFNYwokRbsOJFYQPeag',
          'confidence': 1,
          'premise': null,
          'subpremise': null,
          'neighborhood': 'Manhattan',
          'establishment': 'Port Authority Bus Station'
        },
        'administrativeLevels': {
          'level2long': 'New York County',
          'level2short': 'New York County',
          'level1long': 'New York',
          'level1short': 'NY'
        },
        'streetNumber': '625',
        'streetName': '8th Avenue',
        'city': 'New York',
        'country': 'United States',
        'countryCode': 'US',
        'zipcode': '10109',
        'provider': 'google'
    }]
};

const geoShannonValleyRd = {
    'error': undefined,
    'value': [{
        'formattedAddress': '329 Main St, Fortuna, CA 95540, USA',
        'latitude': 40.5989854,
        'longitude': -124.1657485,
        'extra': {
          'googlePlaceId': 'EiMzMjkgTWFpbiBTdCwgRm9ydHVuYSwgQ0EgOTU1NDAsIFVTQSIbEhkKFAoSCY-kun9IDtRUETa19x1mGAeREMkC',
          'confidence': 0.9,
          'premise': null,
          'subpremise': null,
          'neighborhood': 'Fortuna',
          'establishment': null
        },
        'administrativeLevels': {
          'level2long': 'Humboldt County',
          'level2short': 'Humboldt County',
          'level1long': 'California',
          'level1short': 'CA'
        },
        'streetNumber': '329',
        'streetName': 'Main Street',
        'city': 'Fortuna',
        'country': 'United States',
        'countryCode': 'US',
        'zipcode': '95540',
        'provider': 'google'
    }]
};


describe('geocoder', function() {
    describe('#getClosestPoint', function() {

        it('Error target returns null', function() {
            const geoError = {'error': 'My Error', 'value': [{}]};
            assert.equal(geocoder.getClosestPoint(geoError, [geoError, geoEmpireStateBuilding]), null);
        });

        it('Exactly 2 locations should return each other', function() {
            const locations = [geoStatueOfLiberty, geoEmpireStateBuilding];
            const closestLocStatue = geocoder.getClosestPoint(geoStatueOfLiberty, locations);
            const closestLocEmpire = geocoder.getClosestPoint(geoEmpireStateBuilding, locations);

            assert.equal(closestLocStatue.closestPoint, geoEmpireStateBuilding);
            assert.equal(closestLocEmpire.closestPoint, geoStatueOfLiberty);

            assert.equal(closestLocStatue.distance, closestLocEmpire.distance);
        });

        if('Three locations return closest point', function() {
            const locations = [geoStatueOfLiberty, geoEmpireStateBuilding, geoPortAuthority, geoShannonValleyRd];
            const closestLocStatue = geocoder.getClosestPoint(geoStatueOfLiberty, locations);
            const closestLocEmpire = geocoder.getClosestPoint(geoEmpireStateBuilding, locations);
            const closestLocPort = geocoder.getClosestPoint(geoPortAuthorityBusStation, locations);
            const closestLocShannon = geocoder.getClosestPoint(geoShannonValleyRd, locations);

            assert.equal(closestLocStatue.closestPoint, geoEmpireStateBuilding);
            assert.equal(closestLocEmpire.closestPoint, geoPortAuthorityBusStation);
            assert.equal(closestLocPort.closestPoint, geoEmpireStateBuilding);
            assert.equal(closestLocShannon.closestPoint, geoEmpireStateBuilding);
        });
    });

    describe('#isAddressGeocoded', function() {
        
        it('Empty object should return false', function () {
            assert.equal(geocoder.isAddressGeocoded({}), false);
        });

        it('Error address should return false', function () {
            assert.equal(geocoder.isAddressGeocoded({'error': 'My Error', 'value': [{}]}), false);
        });

    
        it('Empty undefined value should return false', function () {
            assert.equal(geocoder.isAddressGeocoded({'error': undefined}), false);
            assert.equal(geocoder.isAddressGeocoded({'error': undefined, 'value': undefined}), false);
            assert.equal(geocoder.isAddressGeocoded({'error': undefined, 'value': []}), false);
        });

        it('Incomplete address value should return false', function () {
            assert.equal(geocoder.isAddressGeocoded({'error': undefined, 'value': [{}]}), false);
        });

        it('Missing formattedAddress should return false', function () {
            assert.equal(geocoder.isAddressGeocoded({'error': undefined, 'value': [{
                'latitude': 40.7571667,
                'longitude': -73.9908056,
            }]}), false);
        });

        it('Missing latitude should return false', function () {
            assert.equal(geocoder.isAddressGeocoded({'error': undefined, 'value': [{
                'formattedAddress': 'Port Authority Bus Station, 625 8th Ave, New York, NY 10109, USA',
                'longitude': -73.9908056,
            }]}), false);
        });

        it('Missing longitude should return false', function () {
            assert.equal(geocoder.isAddressGeocoded({'error': undefined, 'value': [{
                'formattedAddress': 'Port Authority Bus Station, 625 8th Ave, New York, NY 10109, USA',
                'latitude': 40.7571667,
            }]}), false);
        });

        it('Geocoded address should return true', function() {
            assert.equal(geocoder.isAddressGeocoded(geoStatueOfLiberty), true);
            assert.equal(geocoder.isAddressGeocoded({'error': undefined, 'value': [{
                'formattedAddress': 'Port Authority Bus Station, 625 8th Ave, New York, NY 10109, USA',
                'latitude': 40.7571667,
                'longitude': -73.9908056,
            }]}), true);
        });
    });

    describe('#calculateDistance', function() {
        it('Calculate distance in miles correctly regaurdless of order', function() {
            assert.equal(
                geocoder.calculateDistance(geoStatueOfLiberty.value[0], geoEmpireStateBuilding.value[0], 'mi'),
                geocoder.calculateDistance(geoEmpireStateBuilding.value[0], geoStatueOfLiberty.value[0], 'mi')
            );
        });

        it('Calculate distance in miles correctly', function() {
            assert.equal(geocoder.calculateDistance(geoStatueOfLiberty.value[0], geoEmpireStateBuilding.value[0], 'mi'), 5.120179059850942);
            assert.equal(geocoder.calculateDistance(geoPortAuthorityBusStation.value[0], geoEmpireStateBuilding.value[0], 'mi'), 0.6602152351559334);
            assert.equal(geocoder.calculateDistance(geoStatueOfLiberty.value[0], geoPortAuthorityBusStation.value[0], 'mi'), 5.470224473228176);
            assert.equal(geocoder.calculateDistance(geoShannonValleyRd.value[0], geoPortAuthorityBusStation.value[0], 'mi'), 2591.8679274868896);
        });

        it('Calculate distance in kilometers correctly', function() {
            assert.equal(geocoder.calculateDistance(geoStatueOfLiberty.value[0], geoEmpireStateBuilding.value[0], 'km'), 8.240129448896756);
            assert.equal(geocoder.calculateDistance(geoPortAuthorityBusStation.value[0], geoEmpireStateBuilding.value[0], 'km'), 1.0625134274067904);
            assert.equal(geocoder.calculateDistance(geoStatueOfLiberty.value[0], geoPortAuthorityBusStation.value[0], 'km'), 8.803472934642926);
            assert.equal(geocoder.calculateDistance(geoShannonValleyRd.value[0], geoPortAuthorityBusStation.value[0], 'km'), 4171.207097893461);
        });
    });
});
