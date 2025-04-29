import { useTheme } from "@/context/ThemeContext";
import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import Colors from "../constants/Colors";

const getWeatherIcon = (code) => {
  const iconMap = {
    0: "☀️",
    1: "🌤️",
    2: "⛅",
    3: "☁️",
    45: "🌫️",
    48: "🌫️",
    51: "🌧️",
    53: "🌧️",
    55: "🌧️",
    56: "🌨️",
    57: "🌨️",
    61: "🌧️",
    63: "🌧️",
    65: "🌧️",
    66: "🌨️",
    67: "🌨️",
    71: "❄️",
    73: "❄️",
    75: "❄️",
    77: "❄️",
    80: "🌧️",
    81: "🌧️",
    82: "🌧️",
    85: "❄️",
    86: "❄️",
    95: "⛈️",
    96: "⛈️",
    99: "⛈️",
  };
  return iconMap[code] || "❓";
};

const getWeatherDescription = (code) => {
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
    96: "Thunderstorm w/ slight hail",
    99: "Thunderstorm w/ heavy hail",
  };
  return weatherMap[code] || "Unknown weather";
};

const WeatherForecastScroller = ({ forecast: data }) => {
  const { isDarkMode } = useTheme(); // FIX typo here!
  const backgroundColor = isDarkMode ? "#394a61" : "#e9e9e9";
  const textColor = isDarkMode
    ? Colors.darkTheme.textColor
    : Colors.lightTheme.textColor;

  if (!data?.time) {
    return (
      <View style={{ padding: 20 }}>
        <Text style={{ color: textColor, textAlign: "center" }}>
          No forecast data available
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scrollContainer}
    >
      {data.time.map((date, index) => (
        <View
          key={index}
          style={[styles.dayCard, { backgroundColor: backgroundColor }]} // Dynamic background color
        >
          <Text style={[styles.dateText, { color: textColor }]}>
            {new Date(date).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}
          </Text>

          <Text style={styles.weatherIcon}>
            {getWeatherIcon(data.weathercode[index])}
          </Text>

          <Text style={[styles.weatherDescription, { color: textColor }]}>
            {getWeatherDescription(data.weathercode[index])}
          </Text>

          <View style={styles.temperatures}>
            <Text style={[styles.maxTemp, { color: textColor }]}>
              {data.temperature_2m_max[index]?.toFixed(0)}°
            </Text>
            <Text style={[styles.minTemp, { color: textColor }]}>
              {data.temperature_2m_min[index]?.toFixed(0)}°
            </Text>
          </View>

          <View style={styles.details}>
            <View style={styles.detailContainer}>
              <Text style={styles.emoji}>💧</Text>
              <Text style={[styles.detailText, { color: textColor }]}>
                {data.relative_humidity_2m_mean[index]} %
              </Text>
            </View>
            <View style={styles.detailContainer}>
              <Text style={styles.emoji}>🌧</Text>
              <Text style={[styles.detailText, { color: textColor }]}>
                {data.precipitation_sum[index]?.toFixed(1)} mm
              </Text>
            </View>
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    paddingVertical: 15,
    paddingHorizontal: 10,
  },
  dayCard: {
    width: 150,
    borderRadius: 12,
    padding: 12,
    marginRight: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dateText: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  weatherIcon: {
    fontSize: 32,
    marginBottom: 6,
  },
  weatherDescription: {
    fontSize: 12,
    textAlign: "center",
    marginBottom: 12,
    height: 32,
  },
  temperatures: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 10,
  },
  maxTemp: {
    fontSize: 18,
    fontWeight: "700",
  },
  minTemp: {
    fontSize: 18,
    fontWeight: "500",
    marginLeft: 8,
  },
  details: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 8,
  },
  detailContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  emoji: {
    fontSize: 12,
    marginRight: 4,
  },
  detailText: {
    fontSize: 12,
  },
});

export default WeatherForecastScroller;
