const express = require('express');
const multer = require('multer');
const ip = require('ip');
const { getNotes, writeNotes, validateDatabase } = require('./database');

validateDatabase();

const PORT = 3000;

const app = express();

var storage = multer.diskStorage(
    {
        destination: 'uploads/',
        filename: function (req, file, cb) {
            const split = file.originalname.split('.');
            const suffix = split.splice(split.length - 1)[0];
            const formattedFilename = `${split.join('.').replace(/[^a-zA-Z0-9]/g, '')}-${Date.now()}.${suffix}`;
            console.log(`Uploading ${formattedFilename}...`);
            cb(null, formattedFilename);
        }
    }
);
const upload = multer({ storage });

app.set('trust proxy', true);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(__dirname + '/public/'));
app.use('/uploads', express.static(__dirname + '/../uploads/'));

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

app.post('/api/notes', upload.single("image"), (req, res) => {
    const { title, note } = req.body;

    getNotes(notes => {
        notes.push({
            title,
            note,
            date: new Date(),
            image: req.file ? req.file.filename : undefined,
            id: Math.random().toString(36).substring(7)
        });
        writeNotes(notes, () => {
            res.redirect('/');
        });
    });
});

app.delete('/api/notes/:id', (req, res) => {
    const { id } = req.params;

    getNotes(notes => {
        const index = notes.findIndex(note => note.id === id);
        if (index !== -1) {
            const note = notes[index];
            if (note.image) {
                const fs = require('fs');
                fs.unlink(__dirname + '/../uploads/' + note.image, (err) => {
                    if (err) console.log("Image does not exist");
                    else console.log(note.image, 'was deleted');
                });
            }

            notes.splice(index, 1);
            writeNotes(notes, () => {
                res.sendStatus(200);
            });
        } else {
            res.sendStatus(404);
        }
    });
});

function openBrowser() {
    console.log("Opening browser...");
    const { exec } = require('child_process');
    exec('START http://localhost:3000', (err, stdout, stderr) => {
        if (err) {
            // node couldn't execute the command
            return;
        }

        console.log("READY");
    });
}

app.listen(PORT, () => {
    console.log("[SERVER] listening on port", PORT);
    openBrowser();
})