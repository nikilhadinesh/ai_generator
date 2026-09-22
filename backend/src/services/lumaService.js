const axios = require('axios');

async function generateVideoFromText(prompt) {
  const response = await axios.post(
    'https://api.lumalabs.ai/dream-machine/v1/generations',
    {
      prompt: prompt,
      model: "ray-flash-2",
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.LUMA_API_KEY}`,
        'Content-Type': 'application/json',
      },
    }
  );
  return response.data; // idhu generation ID tharum, video async ah generate aagum
}

module.exports = { generateVideoFromText };