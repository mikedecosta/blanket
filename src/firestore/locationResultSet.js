'use strict';

const APPCONFIG = require('./../../app-config');
const COLLECTION = 'locationResultSet';
const Firestore = require('@google-cloud/firestore');

const db = new Firestore();

const create = function(doc) {
    delete doc.id;
    return db.collection(COLLECTION).add(doc)
    .then(ref => {
        return ref;
    });
};

const read = function (id) {
    return db.collection(COLLECTION).doc(id).get()
    .then(doc => {
        if(!doc.exists) {
            return;
        }

        return doc.data();
    })
    .catch(err => {
        throw new Error('Database error:', err);
    });
};

const update = function(doc) {
    return db.collection(COLLECTION).doc(doc.id).update(doc)
    .then(ref => {
        return ref;
    });
};

const destroy = function(id) {
    return db.collection(COLLECTION).doc(id).delete()
    .then(ref => {
        return ref;
    });
};

module.exports = {
    create,
    read,
    update,
    destroy
};
