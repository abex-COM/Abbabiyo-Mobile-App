import React, { createContext, useState, useEffect, useContext } from "react";
import { Appearance } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Create the ThemeContext
const ThemeContext = createContext();

const loadTheme = async () => {
  const savedTheme = await AsyncStorage.getItem("theme");
  return savedTheme ? JSON.parse(savedTheme) : null;
};

const saveTheme = async (isDarkMode) => {
  await AsyncStorage.setItem("theme", JSON.stringify(isDarkMode));
};

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(null);

  useEffect(() => {
    const fetchTheme = async () => {
      const storedTheme = await loadTheme();
      if (storedTheme !== null) {
        setIsDarkMode(storedTheme);
      } else {
        setIsDarkMode(Appearance.getColorScheme() === "dark");
      }
    };
    fetchTheme();

    const colorSchemeListener = (preferences) => {
      setIsDarkMode(preferences.colorScheme === "dark");
    };

    const subscription = Appearance.addChangeListener(colorSchemeListener);
    return () => subscription.remove();
  }, []);

  const toggleTheme = () => {
    setIsDarkMode((prevMode) => {
      const newMode = !prevMode;
      saveTheme(newMode);
      return newMode;
    });
  };

  if (isDarkMode === null) return null; // Return null until theme is loaded

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Create a custom hook to use the theme
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined)
    throw new Error("theme context used Outside Provider");
  return context;
};
