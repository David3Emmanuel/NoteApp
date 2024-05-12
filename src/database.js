const fs = require('fs');

const databasePath = __dirname + '/database.json';

function getNotes(callback) {
    fs.readFile(databasePath, (err, data) => {
        if (err) throw err;
        const notes = JSON.parse(data);
        callback(notes.notes);
    });
}

function writeNotes(notes, callback = () => { }) {
    fs.writeFile(databasePath, JSON.stringify({notes}, null, 2), err => {
        callback();
    });
}

module.exports = { getNotes, writeNotes };