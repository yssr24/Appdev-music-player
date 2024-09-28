const express = require('express');
const router = express.Router();
const songController = require('../controllers/songController');

router.get('/', songController.getSongs);

router.get('/music_add', songController.getUploadForm);
router.post('/upload', songController.uploadSong);
router.delete('/song/:id/delete', songController.deleteSong);

module.exports = router;
