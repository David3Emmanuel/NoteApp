const express = require('express');
const multer = require('multer');
const ip = require('ip');
const { getNotes, writeNotes } = require('./database');

const PORT = 3000;

const app = express();

var storage = multer.diskStorage(
    {
        destination: 'uploads/',
        filename: function (req, file, cb) {
            const split = file.originalname.split('.');
            const suffix = split.splice(split.length - 1)[0];
            cb(null, `${split.join('.')}-${Date.now()}.${suffix}`);
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
            image: req.file ? req.file.filename : undefined
        });
        writeNotes(notes, () => {
            res.redirect('/');
        });
    });
});

app.listen(PORT, () => {
    console.log("[SERVER] listening on port", PORT);
})