const fs = require('fs');
const path = require('path');

const VIDEOS_DIR = path.join(__dirname, '../../generated_videos');

// Folder illana create pannu
if (!fs.existsSync(VIDEOS_DIR)) {
  fs.mkdirSync(VIDEOS_DIR, { recursive: true });
}

function saveVideoLocally(buffer, requestId) {
  const fileName = `${requestId}.mp4`;
  const filePath = path.join(VIDEOS_DIR, fileName);
  fs.writeFileSync(filePath, buffer);
  return `/videos/${fileName}`; // URL path frontend ku
}

module.exports = { saveVideoLocally };

const IMAGES_DIR = path.join(__dirname, '../../generated_images');
if (!fs.existsSync(IMAGES_DIR)) {
  fs.mkdirSync(IMAGES_DIR, { recursive: true });
}

function saveImageLocally(buffer, requestId) {
  const fileName = `${requestId}.jpg`;
  const filePath = path.join(IMAGES_DIR, fileName);
  fs.writeFileSync(filePath, buffer);
  return `/images/${fileName}`;
}

module.exports = { saveVideoLocally, saveImageLocally }; // existing exports kooda add pannunga