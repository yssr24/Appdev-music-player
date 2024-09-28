const mysql = require('mysql2');
const multer = require('multer');
const path = require('path');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'music_player'
});

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage }).single('songFile');

exports.getSongs = (req, res) => {
    db.query('SELECT * FROM songs', (err, results) => {
        if (err) throw err;
        res.render('index', { songs: results });
    });
};

exports.getUploadForm = (req, res) => {
    res.render('music_add');
};

exports.uploadSong = (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            return res.status(500).send(err);
        }
        const { songTitle, artist } = req.body;
        const filePath = `uploads/${req.file.filename}`;

        db.query('INSERT INTO songs (title, artist, file_path) VALUES (?, ?, ?)', [songTitle, artist, filePath], (err) => {
            if (err) throw err;
            res.redirect('/');
        });
    });

};
const fs = require('fs');

exports.deleteSong = (req, res) => {
    const songId = req.params.id;
    
    db.query('SELECT file_path FROM songs WHERE id = ?', [songId], (err, results) => {
        if (err) throw err;

        if (results.length > 0) {
            const filePath = results[0].file_path;
            
            fs.unlink(filePath, (err) => {
                if (err) throw err;
                
                db.query('DELETE FROM songs WHERE id = ?', [songId], (err) => {
                    if (err) throw err;
                    res.sendStatus(200);
                });
            });
        } else {
            res.status(404).send('Song not found');
        }
    });
};

