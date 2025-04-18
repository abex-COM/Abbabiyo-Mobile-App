const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const askGemini = async (req, res) => {
  const { prompt, language } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required." });
  }

  let systemInstruction = `
You are AbbabiyoAI, an assistant for Ethiopian farmers. 
Your job is to explain agricultural practices, offer crop and livestock advice, 
translate technical information to local understanding, and remain clear and concise. 
You speak in a friendly, helpful tone and avoid long responses.
`;

  // Add language-specific instructions
  if (language === "om") {
    systemInstruction += `
You must respond only in Afan Oromo. Do not use any other language.
`;
  } else if (language === "am") {
    systemInstruction += `
You must respond only in Amharic. Do not use any other language.
`;
  } else {
    systemInstruction += `
Respond in the language used by the user. Do not switch languages unless specified.
`;
  }

  const finalPrompt = `${systemInstruction.trim()}\n\nUser: ${prompt}`;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(finalPrompt);
    const response =
      result?.response?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!response) {
      throw new Error("Empty response from Gemini.");
    }

    res.status(200).json({ response });
  } catch (error) {
    console.error("Gemini API error:", error.message);
    res.status(500).json({ error: "Failed to get response from Gemini API." });
  }
};

module.exports = askGemini;
  