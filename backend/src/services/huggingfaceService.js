const { InferenceClient } = require('@huggingface/inference');

const client = new InferenceClient(process.env.HF_API_TOKEN);

async function generateVideoFromText(prompt) {
  try {
    const videoBlob = await client.textToVideo({
      provider: "fal-ai",
      model: "Wan-AI/Wan2.2-TI2V-5B",
      inputs: prompt,
    });

    // Blob ah Buffer ah convert pannu
    const arrayBuffer = await videoBlob.arrayBuffer();
    return Buffer.from(arrayBuffer);

  } catch (err) {
    throw new Error(err.message || "Video generation failed");
  }
}

module.exports = { generateVideoFromText };