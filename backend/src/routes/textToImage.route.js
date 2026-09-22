const express = require('express');
const router = express.Router();
const { handleTextToImage } = require('../controllers/textToImage.controller');

router.post('/generate', handleTextToImage);

module.exports = router;