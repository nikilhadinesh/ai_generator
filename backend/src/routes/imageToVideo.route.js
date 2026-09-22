const express = require('express');
const multer = require('multer');
const router = express.Router();
const { handleImageToVideo } = require('../controllers/imageToVideo.controller');

const upload = multer({ storage: multer.memoryStorage() });

router.post('/generate', upload.array('images', 10), handleImageToVideo);

module.exports = router;