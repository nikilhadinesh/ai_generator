const path = require('path');
const fs = require('fs');

const VIDEOS_DIR = path.join(__dirname, '../../generated_videos');
if (!fs.existsSync(VIDEOS_DIR)) {
  fs.mkdirSync(VIDEOS_DIR, { recursive: true });
}

function getLatestVideoFile(beforeFiles) {
  const currentFiles = fs.readdirSync(VIDEOS_DIR).filter(f => f.endsWith('.mp4'));
  const newFiles = currentFiles.filter(f => !beforeFiles.includes(f));

  if (newFiles.length > 0) return newFiles[0];

  const sorted = currentFiles
    .map(f => ({ name: f, time: fs.statSync(path.join(VIDEOS_DIR, f)).mtime.getTime() }))
    .sort((a, b) => b.time - a.time);

  return sorted.length > 0 ? sorted[0].name : null;
}

async function generateVideoFromText(prompt) {
  const { Client } = await import('magic-hour');
  const client = new Client({ token: process.env.MAGIC_HOUR_API_KEY });

  const filesBefore = fs.readdirSync(VIDEOS_DIR).filter(f => f.endsWith('.mp4'));

  console.log('Generating video with Magic Hour...');

  // IMPORTANT: single attempt mattum, retry illa - retry pannina credits double ah kalayum
  await client.v1.textToVideo.generate(
    {
      endSeconds: 3.0,          // konjam kammiya vaichirukom, credits save panna
      name: `Video-${Date.now()}`,
      orientation: 'landscape',
      resolution: '480p',
      style: { prompt: prompt },
    },
    {
      waitForCompletion: true,
      downloadOutputs: true,
      downloadDirectory: VIDEOS_DIR,
    }
  );

  const fileName = getLatestVideoFile(filesBefore);

  if (!fileName) {
    throw new Error('Video generated but file not found in download folder');
  }

  return `/videos/${fileName}`;
}

module.exports = { generateVideoFromText };