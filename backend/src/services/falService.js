const { fal } = require('@fal-ai/client');

fal.config({
  credentials: process.env.FAL_API_KEY,
});

async function generateVideoFromText(prompt) {
  const result = await fal.subscribe("fal-ai/wan/v2.1/1.3b/text-to-video", {
    input: {
      prompt: prompt,
    },
    logs: true,
  });

  return result.data.video.url; // idhu video URL ah tharum, buffer illa
}

module.exports = { generateVideoFromText };