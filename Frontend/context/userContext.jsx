import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import Toast from "react-native-toast-message";
// Create context
const UserContext = createContext();
const fetchUser = async (token) => {
  try {
    const resp = await axios.get(
      "http://192.168.74.196:8000/api/users/profile",
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    return resp.data.user;
  } catch (error) {
    if (error.response) {
      console.log(error);
      Toast.show({
        type: "error",
        text1: "Failed while Fetching",
        text2: error?.response?.data?.message,
      });
    }
  }
};
// Provider component
export const UserProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [isEnabled, setIsenabled] = useState(false);

  const [language, setLanguage] = useState("en");
  const {
    data: user = {},
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["user", token], // React Query will refetch when token changes
    queryFn: () => fetchUser(token),
    enabled: !!token,
  });
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
      value={{
        storeToken,
        logout,
        token,
        language,
        setLanguage,
        isEnabled,
        setIsenabled,
        user,
        isLoading,
        refetch,
        error,
      }}
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
