const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

ffmpeg.setFfmpegPath('C:\\ffmpeg\\bin\\ffmpeg.exe');
ffmpeg.setFfprobePath('C:\\ffmpeg\\bin\\ffprobe.exe');

const TEMP_DIR = path.join(__dirname, '../../temp');
const OUTPUT_DIR = path.join(__dirname, '../../generated_videos');

[TEMP_DIR, OUTPUT_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// Step 1: Oru image ah short video clip ah convert pannunga
function imageToClip(imagePath, duration, index) {
  return new Promise((resolve, reject) => {
    const clipPath = path.join(TEMP_DIR, `clip_${index}_${uuidv4()}.mp4`);

    ffmpeg()
      .input(imagePath)
      .inputOptions(['-loop', '1'])
      .outputOptions([
        '-t', String(duration),
        '-vf', 'scale=trunc(iw/2)*2:trunc(ih/2)*2',
        '-pix_fmt', 'yuv420p',
        '-r', '24'
      ])
      .on('start', (cmd) => console.log(`Clip ${index} command:`, cmd))
      .on('stderr', (line) => console.log(`Clip ${index} stderr:`, line))
      .on('error', reject)
      .on('end', () => resolve(clipPath))
      .save(clipPath);
  });
}

// Step 2: Ella clips ah join pannunga + caption overlay
function joinClips(clipPaths, caption) {
  return new Promise((resolve, reject) => {
    const outputFileName = `${uuidv4()}.mp4`;
    const outputPath = path.join(OUTPUT_DIR, outputFileName);
    const listFilePath = path.join(TEMP_DIR, `${uuidv4()}_list.txt`);

    let listContent = '';
    clipPaths.forEach((clipPath) => {
      const normalizedPath = clipPath.replace(/\\/g, '/');
      listContent += `file '${normalizedPath}'\n`;
    });
    fs.writeFileSync(listFilePath, listContent);

    const safeCaption = caption.replace(/'/g, '').replace(/:/g, '');

    ffmpeg()
      .input(listFilePath)
      .inputOptions(['-f', 'concat', '-safe', '0'])
      .outputOptions([
        '-vf', `drawtext=text='${safeCaption}':fontcolor=white:fontsize=36:x=(w-text_w)/2:y=h-80:box=1:boxcolor=black@0.5:boxborderw=10`,
        '-pix_fmt', 'yuv420p',
        '-c:v', 'libx264'
      ])
      .on('start', (cmd) => console.log('Join command:', cmd))
      .on('stderr', (line) => console.log('Join stderr:', line))
      .on('error', (err) => {
        fs.existsSync(listFilePath) && fs.unlinkSync(listFilePath);
        reject(err);
      })
      .on('end', () => {
        fs.existsSync(listFilePath) && fs.unlinkSync(listFilePath);
        resolve({ outputPath, outputFileName });
      })
      .save(outputPath);
  });
}

async function createSlideshow(imagePaths, caption) {
  const durationPerImage = 2;

  // Step 1: Each image ah clip ah convert pannunga
  const clipPaths = [];
  for (let i = 0; i < imagePaths.length; i++) {
    const clipPath = await imageToClip(imagePaths[i], durationPerImage, i);
    clipPaths.push(clipPath);
  }

  // Step 2: Clips ah join pannunga
  const result = await joinClips(clipPaths, caption);

  // Cleanup: temp clips delete pannunga
  clipPaths.forEach(p => fs.existsSync(p) && fs.unlinkSync(p));

  return result;
}

module.exports = { createSlideshow };