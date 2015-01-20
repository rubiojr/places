#!/usr/bin/env node
var geocoder = require('node-geocoder').getGeocoder('openstreetmap')
var fs = require('fs');

var search = process.argv.slice(2).join(' ');

var toFeature = function(title, json) {
    var obj = {
        geometry: {
            coordinates: [json.longitude, json.latitude],
            type: 'Point',
        },
        type: 'Feature',
        properties: {
            title: title
        }
    }

    return obj;
}

var addPlace = function(feat) {
    var obj = JSON.parse(fs.readFileSync('places.geojson'));
    obj.features.push(feat);

    fs.writeFileSync('places.geojson', JSON.stringify(obj, undefined, 2));

    console.log('Added feature:');
    console.log(JSON.stringify(feat, undefined, 2));
}

if (process.argv.length <= 2) {
    console.error('Usage: places.js <search term>');
    process.exit(1);
}

geocoder.geocode(search)
    .then(function(res) {
        if (res.length !== 0) {
            addPlace(toFeature(search, res[0]));
        } else {
            console.error('No results returned.');
        };
    })
    .catch(function(err) {
        console.log(err);
    });
