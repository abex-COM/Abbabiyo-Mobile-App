import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { useTheme } from "@/context/ThemeContext";
import Colors from "../constants/Colors";
import gregorianToEthiopian from "@/app/utils/dateCovertor"; // Ensure path is correct
import { t, i18n } from "i18next";
import { useLanguage } from "@/context/LanguageContexts";

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
    0: t("clear_sky"),
    1: t("mainly_clear"),
    2: t("partly_cloudy"),
    3: t("overcast"),
    45: t("fog"),
    48: t("rime_fog"),
    51: t("light_drizzle"),
    53: t("moderate_drizzle"),
    55: t("dense_drizzle"),
    56: t("light_freezing_drizzle"),
    57: t("dense_freezing_drizzle"),
    61: t("slight_rain"),
    63: t("moderate_rain"),
    65: t("heavy_rain"),
    66: t("light_freezing_rain"),
    67: t("heavy_freezing_rain"),
    71: t("slight_snow"),
    73: t("moderate_snow"),
    75: t("heavy_snow"),
    77: t("snow_grains"),
    80: t("slight_rain_showers"),
    81: t("moderate_rain_showers"),
    82: t("violent_rain_showers"),
    85: t("slight_snow_showers"),
    86: t("heavy_snow_showers"),
    95: t("thunderstorm"),
    96: t("thunderstorm_light_hail"),
    99: t("thunderstorm_heavy_hail"),
  };
  return weatherMap[code] || t("unknown_weather");
};

const WeatherForecastScroller = ({ forecast: data }) => {
  const { isDarkMode } = useTheme();
  const { language } = useLanguage();
  const backgroundColor = isDarkMode ? "#394a61" : "#e9e9e9";
  const textColor = isDarkMode
    ? Colors.darkTheme.textColor
    : Colors.lightTheme.textColor;

  if (!data?.time) {
    return (
      <View style={{ padding: 20 }}>
        <Text style={{ color: textColor, textAlign: "center" }}>
          {t("no_forecast_data")}
        </Text>
      </View>
    );
  }

  const currentLang = language; // e.g., "en", "am", "om"

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scrollContainer}
    >
      {data.time.map((dateStr, index) => {
        const date = new Date(dateStr);
        const ethDate = gregorianToEthiopian(
          date.getFullYear(),
          date.getMonth() + 1,
          date.getDate()
        );

        const ethMonthName = t(`ethiopian_months.${ethDate.ethMonth - 1}`);

        // Format date according to language
        let formattedDate = "";
        if (currentLang === "am" || currentLang === "om") {
          // Month Day, Year
          formattedDate = `${ethMonthName} ${ethDate.ethDay}, ${ethDate.ethYear}`;
        } else {
          // Day Month Year
          formattedDate = `${ethDate.ethDay} ${ethMonthName} ${ethDate.ethYear}`;
        }

        return (
          <View key={index} style={[styles.dayCard, { backgroundColor }]}>
            <Text style={[styles.dateText, { color: textColor }]}>
              {formattedDate}
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
        );
      })}
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
