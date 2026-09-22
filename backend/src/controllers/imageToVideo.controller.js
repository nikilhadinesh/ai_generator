const fs = require('fs');
const path = require('path');
const { createSlideshow } = require('../services/ffmpegService');
const { uploadVideoToS3 } = require('../services/s3Service');
const { createVideoRequest, updateVideoRequest } = require('../models/VideoRequest');

async function handleImageToVideo(req, res) {
  const { caption } = req.body;
  const files = req.files;

  if (!files || files.length === 0) {
    return res.status(400).json({ error: 'At least one image is required' });
  }

  const tempPaths = [];

  try {
    const request = await createVideoRequest({ userId: 'guest', type: 'image', prompt: caption || '' });
    await updateVideoRequest(request.requestId, { status: 'processing' });

    // Temp files save pannunga (multer memory storage la irundhu)
    const TEMP_DIR = path.join(__dirname, '../../temp');
    files.forEach((file, i) => {
      const tempPath = path.join(TEMP_DIR, `${request.requestId}_${i}.jpg`);
      fs.writeFileSync(tempPath, file.buffer);
      tempPaths.push(tempPath);
    });

    // FFmpeg vachi video create pannunga
    const { outputPath, outputFileName } = await createSlideshow(tempPaths, caption || '');

    // S3 la upload pannunga
    const s3Url = await uploadVideoToS3(outputPath, outputFileName);

    await updateVideoRequest(request.requestId, { status: 'done', videoUrl: s3Url });

    // Temp files cleanup pannunga
    tempPaths.forEach(p => fs.existsSync(p) && fs.unlinkSync(p));
    fs.existsSync(outputPath) && fs.unlinkSync(outputPath);

    res.json({ requestId: request.requestId, status: 'done', videoUrl: s3Url });
  } catch (err) {
    console.error(err);
    tempPaths.forEach(p => fs.existsSync(p) && fs.unlinkSync(p));
    res.status(500).json({ error: err.message });
  }
}

module.exports = { handleImageToVideo };