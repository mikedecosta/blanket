'use strict';

const express = require('express');
const geocoder = require('./geocoder/geocoder');
const locationResultSet = require('./firestore/locationResultSet');
const GITHUB_URL = 'https://github.com/mikedecosta/blanket';

const app = express();
app.use(express.json());

app.get('/', (request, response) => {
  response.redirect(GITHUB_URL);
});

app.get('/locationResultSet/:resultSetId', (request, response) => {
    const id = request.params.resultSetId;
    if(!id) {
        return response(400).send('`locationResultSet` endpoint requires a `resultSetId` param');
    }
    locationResultSet.read(id)
    .then(ref => {
        if(!(ref && ref.locations)) {
            return response.status(500).send('Unknown error getting `locationResultSet`');
        }

        return response.end(JSON.stringify(ref));
    });
});

app.post('/locations', (request, response) => {
    if(!request.body.locations || request.body.locations.length < 2) {
        return response.status(400).send('`locations` endpoint requires `locations` data array size to be greater than 1');
    }

    locationResultSet.create({'locations': JSON.stringify(request.body.locations)})
    .then(ref => {
        if(!(ref && ref.id)) {
            return response.status(500).send('Unknown error creating `locationResultSet`');
        }

        geocoder.offlineProcess(ref.id);
        return response.end(JSON.stringify({'locationResultSet.id': ref.id}));
    });
});

if (module === require.main) {
  const server = app.listen(process.env.PORT || 8080, () => {
    const port = server.address().port;
    console.log(`App listening on port ${port}`);
  });
}

module.exports = app;
