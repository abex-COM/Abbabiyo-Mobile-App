const axios = require("axios");
const User = require("../models/userModel");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const getRecommendations = async (req, res) => {
  const { farmerId, farmIndex = 0, language = "en" } = req.body;

  if (!farmerId) {
    return res.status(400).json({ error: "Farmer ID is required." });
  }

  try {
    const farmer = await User.findById(farmerId);
    if (!farmer) return res.status(404).json({ error: "Farmer not found." });

    const farm = farmer.farmLocations[farmIndex];
    if (!farm || !farm.lat || !farm.lon) {
      return res.status(400).json({ error: "Farm location is invalid or missing." });
    }

    const weatherRes = await axios.get(
      `https://api.openweathermap.org/data/2.5/onecall`,
      {
        params: {
          lat: farm.lat,
          lon: farm.lon,
          exclude: "minutely,hourly,alerts",
          units: "metric",
          appid: process.env.OPENWEATHER_API_KEY,
        },
      }
    );

    const forecast = weatherRes.data.daily.slice(0, 8);

    const season = getCurrentSeason();
    const weatherSummary = forecast
      .map((day, i) => {
        const date = new Date(day.dt * 1000).toDateString();
        return `Day ${i + 1} (${date}): ${day.weather[0].description}, high ${day.temp.max}°C, low ${day.temp.min}°C.`;
      })
      .join("\n");

    let systemInstruction = `
You are an agricultural advisor for Ethiopian farmers.

Based on the following:
- Location: Region: ${farmer.location.region}, Zone: ${farmer.location.zone}, Woreda: ${farmer.location.woreda}
- Season: ${season}
- 8-day weather forecast:
${weatherSummary}

Give only 5 short, personalized recommendations related to planting, harvesting, irrigation, or pest control. 
Each recommendation should be a separate bullet point. Be clear, simple, and no more than one sentence per recommendation.
`;

    if (language === "om") {
      systemInstruction += `\nRespond only in Afan Oromo.`;
    } else if (language === "am") {
      systemInstruction += `\nRespond only in Amharic.`;
    } else {
      systemInstruction += `\nRespond in English.`;
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(systemInstruction);
    const response = result?.response?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!response) {
      throw new Error("Empty response from Gemini.");
    }

    res.status(200).json({
      location: farmer.location,
      farm: farm,
      forecast: forecast,
      recommendations: response,
    });
  } catch (error) {
    console.error("Recommendation error:", error.message);
    res.status(500).json({ error: "Something went wrong." });
  }
};

function getCurrentSeason() {
  const month = new Date().getMonth() + 1;
  if ([12, 1, 2].includes(month)) return "Bega (dry season)";
  if ([3, 4, 5].includes(month)) return "Belg (short rainy season)";
  if ([6, 7, 8, 9].includes(month)) return "Kiremt (main rainy season)";
  return "Meher (harvest/post-rainy season)";
}

module.exports = { getRecommendations };