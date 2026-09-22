const express = require('express');
const router = express.Router();
const { handleTextToVideo } = require('../controllers/textToVideo.controller');

router.post('/generate', handleTextToVideo);

module.exports = router;