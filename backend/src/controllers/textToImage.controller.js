const { generateImageFromText } = require('../services/pollinationsService');
const { saveImageLocally } = require('../services/fileService');
const { createVideoRequest, updateVideoRequest } = require('../models/VideoRequest');

async function handleTextToImage(req, res) {
  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: 'Prompt is required' });

  try {
    const request = await createVideoRequest({ userId: 'guest', type: 'image-gen', prompt });
    await updateVideoRequest(request.requestId, { status: 'processing' });

    const imageBuffer = await generateImageFromText(prompt);
    const imagePath = saveImageLocally(imageBuffer, request.requestId);
    const imageUrl = `http://localhost:5000${imagePath}`;

    await updateVideoRequest(request.requestId, { status: 'done', videoUrl: imageUrl });
    res.json({ requestId: request.requestId, status: 'done', imageUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}

module.exports = { handleTextToImage };