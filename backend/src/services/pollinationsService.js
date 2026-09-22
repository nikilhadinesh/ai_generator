const axios = require('axios');

async function generateImageFromText(prompt) {
  const encodedPrompt = encodeURIComponent(prompt);
  const url = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=768&height=768&nologo=true`;

  const response = await axios.get(url, {
    responseType: 'arraybuffer',
    timeout: 60000,
  });

  return Buffer.from(response.data);
}

module.exports = { generateImageFromText };