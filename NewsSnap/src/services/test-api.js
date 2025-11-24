const API_KEY = "AIzaSyDdvAbWWPbbJFsv7AMHg7Fo1L1IsDv08DQ";

async function listModels() {
  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1/models?key=${API_KEY}`
    );

    const data = await res.json();

    if (data.models) {
      console.log("Available models:");
      data.models.forEach((m) => console.log(" - " + m.name));
    } else {
      console.log("❌ No models found. Full response:");
      console.log(JSON.stringify(data, null, 2));
    }
  } catch (err) {
    console.error("Failed to list models:", err);
  }
}

listModels();
