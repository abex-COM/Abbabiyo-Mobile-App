const axios = require("axios");
const User = require("../models/userModel");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const getRecommendations = async (req, res) => {
  console.log("============ INCOMING REQUEST ============");
  console.log("Headers:", req.headers);
  console.log("Method:", req.method);
  console.log("URL:", req.originalUrl);
  console.log("Body:", req.body);
  console.log("==========================================");

  const { farmerId, farmId, language = "en" } = req.body;

  if (!farmerId || !farmId) {
    return res.status(400).json({ error: "Farmer ID and Farm ID are required." });
  }
  try {
    const farmer = await User.findById(farmerId);
    if (!farmer) {
      return res.status(404).json({ error: "Farmer not found." });
    }

    const farm = farmer.farmLocations.find(f => f._id.toString() === farmId);
    if (!farm || farm.lat == null || farm.lon == null) {
      return res.status(400).json({ error: "Farm location is invalid or missing." });
    }

    // Fetch weather data from Open-Meteo (free API)
    const weatherRes = await axios.get("https://api.open-meteo.com/v1/forecast", {
      params: {
        latitude: farm.lat,
        longitude: farm.lon,
        daily: "weathercode,temperature_2m_max,temperature_2m_min,precipitation_sum",
        forecast_days: 8,
        timezone: "auto"
      },
    });

    const forecast = weatherRes.data.daily;
    const season = getCurrentSeason();

    // Format weather summary
    const weatherSummary = forecast.time.map((date, i) => {
      const weatherDescription = getWeatherDescription(forecast.weathercode[i]);
      return `Day ${i + 1} (${date}): ${weatherDescription}, high ${forecast.temperature_2m_max[i]}°C, low ${forecast.temperature_2m_min[i]}°C, rain ${forecast.precipitation_sum[i]}mm`;
    }).join("\n");

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

    if (language === "om") systemInstruction += `\nRespond only in Afan Oromo.`;
    else if (language === "am") systemInstruction += `\nRespond only in Amharic.`;
    else systemInstruction += `\nRespond in English.`;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent([{ text: systemInstruction }]);
    const parts = result?.response?.candidates?.[0]?.content?.parts;
    const response = parts?.map(p => p.text).join("\n").trim();

    if (!response) throw new Error("Empty response from Gemini.");

    res.status(200).json({
      location: farmer.location,
      farm,
      forecast: {
        time: forecast.time,
        temperature_2m_max: forecast.temperature_2m_max,
        temperature_2m_min: forecast.temperature_2m_min,
        precipitation_sum: forecast.precipitation_sum
      },
      recommendations: response,
    });
  } catch (error) {
    console.error("Recommendation error:", error);
    res.status(500).json({
      error: `Something went wrong while generating recommendations: ${error.message}`,
    });
  }
};

// Helper function to convert weather codes to descriptions
function getWeatherDescription(code) {
  const weatherMap = {
    0: "Clear sky",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Fog",
    48: "Depositing rime fog",
    51: "Light drizzle",
    53: "Moderate drizzle",
    55: "Dense drizzle",
    56: "Light freezing drizzle",
    57: "Dense freezing drizzle",
    61: "Slight rain",
    63: "Moderate rain",
    65: "Heavy rain",
    66: "Light freezing rain",
    67: "Heavy freezing rain",
    71: "Slight snow fall",
    73: "Moderate snow fall",
    75: "Heavy snow fall",
    77: "Snow grains",
    80: "Slight rain showers",
    81: "Moderate rain showers",
    82: "Violent rain showers",
    85: "Slight snow showers",
    86: "Heavy snow showers",
    95: "Thunderstorm",
    96: "Thunderstorm with slight hail",
    99: "Thunderstorm with heavy hail"
  };
  return weatherMap[code] || "Unknown weather";
}

function getCurrentSeason() {
  const month = new Date().getMonth() + 1;
  if ([12, 1, 2].includes(month)) return "Bega (dry season)";
  if ([3, 4, 5].includes(month)) return "Belg (short rainy season)";
  if ([6, 7, 8, 9].includes(month)) return "Kiremt (main rainy season)";
  return "Meher (harvest/post-rainy season)";
}

module.exports = { getRecommendations };