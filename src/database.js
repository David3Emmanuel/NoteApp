const fs = require('fs');
const Ajv = require('ajv');
const addFormats = require("ajv-formats");

const databasePath = __dirname + '/database.json';

function validateDatabase() {
    const ajv = new Ajv();
    addFormats(ajv);

    const schema = require('./database.schema.json');
    const data = require(databasePath);

    if (!ajv.validate(schema, data)) {
        console.log(ajv.errors);
        process.exit(1);
    }
}

function getNotes(callback) {
    fs.readFile(databasePath, (err, data) => {
        if (err) throw err;
        try {
            const notes = JSON.parse(data);
            callback(notes?.notes || []);
        } catch (e) {
            callback([]);
        }
    });
}

function writeNotes(notes, callback = () => { }) {
    fs.writeFile(databasePath, JSON.stringify({ notes }, null, 2), err => {
        callback();
    });
}

module.exports = { getNotes, writeNotes, validateDatabase };