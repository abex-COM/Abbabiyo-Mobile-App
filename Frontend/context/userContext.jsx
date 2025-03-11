import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Create context
const UserContext = createContext();

// Provider component
export const UserProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [language, setLanguage] = useState("en");

  const storeToken = async (token) => {
    try {
      await AsyncStorage.setItem("token", token);
      console.log("token saved");
      setToken(token);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const fetchToken = async () => {
      const storedToken = await AsyncStorage.getItem("token");
      setToken(storedToken);
    };

    fetchToken();
  }, []);

  const logout = async () => {
    try {
      await AsyncStorage.removeItem("token");
      setToken(null);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <UserContext.Provider
      value={{ storeToken, logout, token, language, setLanguage }}
    >
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to access the UserContext
export const useUser = () => {
  const context = useContext(UserContext); // Pass the UserContext here
  if (context === undefined) {
    throw new Error("user context used outside User Provider");
  }
  return context;
};
