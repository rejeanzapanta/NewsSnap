import { GoogleGenerativeAI } from "@google/generative-ai";

console.log('API Key exists:', !!import.meta.env.VITE_GEMINI_API_KEY);
console.log('API Key length:', import.meta.env.VITE_GEMINI_API_KEY?.length);

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

const MODEL_PRIORITY = [
  "gemini-2.5-flash",
  "gemini-2.5-pro",
  "gemini-2.5-flash-lite",
  "gemini-2.0-flash",
  "gemini-2.0-flash-lite",
];

export async function summarizeLink(linkText, length = "standard") {
  const lengthInstructions = {
    short: "Provide a very short summary (2-3 sentences) with only the main points.",
    standard: "Provide a balanced summary (1-2 paragraphs) with key details.",
    long: "Provide a comprehensive, in-depth summary (3-4 paragraphs) with full context and analysis.",
  };

  const prompt = `
    Please summarize the news article from this link: ${linkText}

    Requirements:
    - ${lengthInstructions[length]}
    - Focus on key facts, main points, and important context
    - Maintain factual accuracy
    - Write in clear, concise language

    If this is not a valid news article or cannot be accessed, please explain the issue.
  `;

  let lastError;

  for (const modelName of MODEL_PRIORITY) {
    console.log(`🧠 Trying model: ${modelName}`);
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent(prompt);
      return result.response.text(); // ✅ Success — stop trying others
    } catch (error) {
      console.warn(`⚠️ Model ${modelName} failed:`, error.message);
      lastError = error;

      // Handle overloads or temporary errors only — not fatal ones
      if (error.message.includes("503") || error.message.includes("overloaded")) {
        console.log("Model overloaded, trying next...");
        continue; // Try the next model
      } else {
        break; // Stop if it's a different kind of error
      }
    }
  }

  console.error("❌ All models failed:", lastError);
  throw new Error("All Gemini models are currently unavailable. Please try again later.");
}
