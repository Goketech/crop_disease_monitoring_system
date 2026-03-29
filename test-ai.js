const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config({ path: ".env.local" });

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || "");

async function listModels() {
  console.log("Checking API Key: " + (process.env.GOOGLE_AI_API_KEY ? "Found" : "Missing"));
  try {
    const result = await genAI.listModels();
    console.log("Available Models:");
    result.models.forEach(m => {
      if (m.supportedGenerationMethods.includes("generateContent")) {
        console.log(`- ${m.name} (Supports Images: ${m.supportedGenerationMethods.includes("generateContent") ? 'Yes' : 'No'})`);
      }
    });
  } catch (err) {
    console.error("Failed to list models:", err.message);
  }
}

listModels();
