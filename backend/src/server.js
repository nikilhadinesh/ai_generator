require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createVideoRequest, getVideoRequest } = require('./models/VideoRequest');

const app = express();
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'Server is running ✅' });
});

// Test DynamoDB connection - create a dummy request
app.post('/test-db', async (req, res) => {
  try {
    const item = await createVideoRequest({ userId: 'test-user', type: 'text', prompt: 'Hello DynamoDB' });
    res.json({ message: 'DynamoDB write success ✅', item });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Test fetch
app.get('/test-db/:id', async (req, res) => {
  try {
    const item = await getVideoRequest(req.params.id);
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


const textToVideoRoute = require('./routes/textToVideo.route');
app.use('/api/text-to-video', textToVideoRoute);

const path = require('path');
app.use('/videos', express.static(path.join(__dirname, '../generated_videos')));

const imageToVideoRoute = require('./routes/imageToVideo.route');
app.use('/api/image-to-video', imageToVideoRoute);

const textToImageRoute = require('./routes/textToImage.route');
app.use('/api/text-to-image', textToImageRoute);

// static serving for images
app.use('/images', express.static(path.join(__dirname, '../generated_images')));

const authRoute = require('./routes/auth.route');
app.use('/api/auth', authRoute);