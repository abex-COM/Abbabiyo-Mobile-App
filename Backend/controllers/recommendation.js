const axios = require("axios");
const User = require("../models/userModel");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const getRecommendations = async (req, res) => {
  const { farmerId, farmId, language = "en" } = req.body;

  if (!farmerId || !farmId) {
    return res
      .status(400)
      .json({ error: "Farmer ID and Farm ID are required." });
  }

  try {
    const farmer = await User.findById(farmerId);
    if (!farmer) return res.status(404).json({ error: "Farmer not found." });

    const farm = farmer.farmLocations.find((f) => f._id.toString() === farmId);
    if (!farm || farm.lat == null || farm.lon == null) {
      return res
        .status(400)
        .json({ error: "Farm location is invalid or missing." });
    }

    const forecastRes = await axios.get(
      "https://api.open-meteo.com/v1/forecast",
      {
        params: {
          latitude: farm.lat,
          longitude: farm.lon,
          daily:
            "temperature_2m_max,temperature_2m_min,precipitation_sum,relative_humidity_2m_mean,weathercode",
          forecast_days: 16,
          timezone: "auto",
        },
      }
    );

    const forecast = forecastRes.data.daily;
    const season = getCurrentSeason();

    // Generate readable forecast summary for Gemini
    const weatherSummary = forecast.time
      .map((date, i) => {
        const weather = getWeatherDescription(forecast.weathercode[i]);
        const maxT = forecast.temperature_2m_max[i];
        const minT = forecast.temperature_2m_min[i];
        const rain = forecast.precipitation_sum[i];
        const humidity = forecast.relative_humidity_2m_mean[i];
        return `Day ${
          i + 1
        } (${date}): ${weather}, Max ${maxT}°C, Min ${minT}°C, Humidity ${humidity}%, Rain ${rain}mm`;
      })
      .join("\n");

    let prompt = `
You are an agricultural advisor for Ethiopian farmers.

Given:
- Location: Region: ${farmer.location.region}, Zone: ${farmer.location.zone}, Woreda: ${farmer.location.woreda}
- Season: ${season}
- Weather forecast (next 16 days): 
${weatherSummary}

Provide 5 short, clear farming recommendations based on season and forecast. Focus on planting, irrigation, harvesting, or pest control. One sentence each.
`;

    if (language === "om") prompt += "\nRespond only in Afan Oromo.";
    else if (language === "am") prompt += "\nRespond only in Amharic.";
    else prompt += "\nRespond in English.";

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent([{ text: prompt }]);
    const parts = result?.response?.candidates?.[0]?.content?.parts;
    const geminiResponse = parts
      ?.map((p) => p.text)
      .join("\n")
      .trim();

    if (!geminiResponse) throw new Error("Empty response from Gemini.");

    // Final response object
    const responseObject = {
      season,
      location: farmer.location,
      forecast: {
        time: forecast.time,
        temperature_2m_max: forecast.temperature_2m_max,
        temperature_2m_min: forecast.temperature_2m_min,
        relative_humidity_2m_mean: forecast.relative_humidity_2m_mean,
        precipitation_sum: forecast.precipitation_sum,
        weathercode: forecast.weathercode,
      },
      recommendations: geminiResponse,
    };

    // Log the final response object before sending it

    res.status(200).json(responseObject);
  } catch (error) {
    console.error("Recommendation error:", error);
    res.status(500).json({
      error: `Something went wrong while generating recommendations: ${error.message}`,
    });
  }
};

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
    99: "Thunderstorm with heavy hail",
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

const prescribe = async (req, res) => {
  const { detectedDisease, language = "en" } = req.body;

  if (!detectedDisease) {
    return res.status(400).json({ error: "Detected disease is required." });
  }

  try {
    let prompt = `
You are an expert agricultural advisor helping Ethiopian corn farmers.

A disease has been detected in a corn plant: "${detectedDisease}".

Your task is to return the result as a JSON object with the following structure:
{
  "disease": "<name of the disease>",
  "description": "<short description of the disease>",
  "recommendedMedications": ["<medication 1>", "<medication 2>"],
  "farmerRecommendations": ["<recommendation 1>", "<recommendation 2>", "..."]
}

Use simple, clear, and actionable language.
Respond in the specified language.`.trim();

    if (language === "om") prompt += "\nRespond only in Afan Oromo.";
    else if (language === "am") prompt += "\nRespond only in Amharic.";
    else prompt += "\nRespond only in English.";

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent([{ text: prompt }]);
    const parts = result?.response?.candidates?.[0]?.content?.parts;
    const geminiResponse = parts?.map((p) => p.text).join("\n").trim();

    if (!geminiResponse) {
      throw new Error("Empty response from Gemini.");
    }

    // Try to extract JSON from the text (Gemini might wrap it with text or markdown)
    const jsonMatch = geminiResponse.match(/\{[\s\S]*?\}/);
    if (!jsonMatch) {
      throw new Error("Failed to parse JSON from Gemini response.");
    }

    const structuredResponse = JSON.parse(jsonMatch[0]);

    res.status(200).json(structuredResponse);
  } catch (error) {
    console.error("Prescription error:", error);
    res.status(500).json({
      error: `Failed to generate disease prescription: ${error.message}`,
    });
  }
};


module.exports = { getRecommendations, prescribe};