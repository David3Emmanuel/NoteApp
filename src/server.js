const express = require('express');
const ip = require('ip');
const { getNotes, writeNotes } = require('./database');

const PORT = 3000;

const app = express();
app.set('trust proxy', true);
app.use(express.static(__dirname + '/public/'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.get('/new', (req, res) => {
    res.sendFile(__dirname + '/public/new.html');
})

app.get('/api/ip', (req, res) => {
    res.json({ ip: ip.address() });
})

app.get('/api/notes', (req, res) => {
    getNotes(notes => {
        res.json(notes);
    })
})

app.post('/api/notes', (req, res) => {
    const { title, note } = req.body;

    getNotes(notes => {
        notes.push({ title, note, date: new Date() });
        writeNotes(notes, () => {
            res.redirect('/');
        });
    });
});

app.listen(PORT, () => {
    console.log("[SERVER] listening on port", PORT);
})