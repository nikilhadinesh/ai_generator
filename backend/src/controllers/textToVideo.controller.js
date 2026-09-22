const { generateVideoFromText } = require('../services/magicHourService');
const { createVideoRequest, updateVideoRequest } = require('../models/VideoRequest');

async function handleTextToVideo(req, res) {
  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: 'Prompt is required' });

  try {
    const request = await createVideoRequest({ userId: 'guest', type: 'text', prompt });
    await updateVideoRequest(request.requestId, { status: 'processing' });

    const videoPath = await generateVideoFromText(prompt);
    const videoUrl = `http://localhost:5000${videoPath}`;

    await updateVideoRequest(request.requestId, { status: 'done', videoUrl });
    res.json({ requestId: request.requestId, status: 'done', videoUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}

module.exports = { handleTextToVideo };