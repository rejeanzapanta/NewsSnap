const functions = require("firebase-functions");
const {GoogleGenerativeAI} = require("@google/generative-ai");
const cors = require("cors")({origin: true});

// Initialize Gemini client
const genAI = new GoogleGenerativeAI({
  keyFile: "./gemini-key.json", // your JSON key file
});

// List of fallback models (highest priority first)
const MODEL_PRIORITY = [
  "gemini-2.5-flash",
  "gemini-2.5-pro",
  "gemini-2.5-flash-lite",
  "gemini-2.0-flash",
  "gemini-2.0-flash-lite",
];

exports.summarize = functions.https.onRequest(async (req, res) => {
  cors(req, res, async () => {
    try {
      const {text} = req.body;

      if (!text) {
        return res.status(400).send("No text provided");
      }

      let lastError;

      // Try models in order
      for (const modelName of MODEL_PRIORITY) {
        functions.logger.info(`🧠 Trying model: ${modelName}`);

        try {
          const model = genAI.getGenerativeModel({model: modelName});
          const result = await model.generateContent(text);
          const summary = result.response.text();

          // ✅ Success — return immediately
          return res.json({summary, modelUsed: modelName});
        } catch (error) {
          functions.logger.warn(
              `⚠️ Model ${modelName} failed: ${error.message}`,
          );
          lastError = error;

          // If temporary issue, try next model
          if (
            error.message.includes("503") ||
            error.message.includes("overloaded")
          ) {
            continue;
          } else {
            break; // Other error types — stop retrying
          }
        }
      }

      // If all models failed
      functions.logger.error("❌ All models failed:", lastError);

      return res
          .status(503)
          .send(
              // eslint-disable-next-line max-len
              "All Gemini models are currently unavailable. Please try again later.",
          );
    } catch (error) {
      functions.logger.error("Error summarizing text:", error);
      res.status(500).send("Error summarizing text");
    }
  });
});
