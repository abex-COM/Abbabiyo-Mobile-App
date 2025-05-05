import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import Toast from "react-native-toast-message";
import baseUrl from "@/baseUrl/baseUrl";
// import { useNavigation } from "expo-router";
import { getSocket, initiateSocketConnection } from "@/app/utils/socket";
// import useNavigation from '@react-navigation/native';
import { useNavigation } from "@react-navigation/native";
const UserContext = createContext();

const fetchUser = async (token) => {
  try {
    const resp = await axios.get(`${baseUrl}/api/users/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return resp.data.user || {};
  } catch (error) {
    Toast.show({
      type: "error",
      text1: "Fetch Error",
      text2: error?.response?.data?.message || "An error occurred",
    });
    throw error;
  }
};

export const UserProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [isEnabled, setIsEnabled] = useState(false);
  const [language, setLanguage] = useState("en");
  const navigation = useNavigation();

  const {
    data: user = {},
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["user", token],
    queryFn: () => fetchUser(token),
    enabled: !!token,
    retry: false,
    onError: (error) => {
      if (error?.response?.status === 401) {
        Toast.show({
          type: "error",
          text1: "Unauthorized",
          text2: "Your session has expired or your account was deleted.",
        });
        logout();
      }
    },
  });

  const storeToken = async (newToken) => {
    try {
      await AsyncStorage.setItem("token", newToken);
      setToken(newToken);
    } catch (err) {
      console.log("Failed to store token:", err);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem("token");
      setToken(null);
      const socket = getSocket();
      if (socket?.connected) socket.disconnect();
      navigation.navigate("welcomeScreen");
    } catch (err) {
      console.log("Logout error:", err);
    }
  };

  // Fetch token on mount
  useEffect(() => {
    const loadToken = async () => {
      const storedToken = await AsyncStorage.getItem("token");
      if (storedToken) setToken(storedToken);
    };
    loadToken();
  }, []);

  // Setup WebSocket connection when user ID is available
  useEffect(() => {
    if (!token || !user?._id) return;

    initiateSocketConnection(user._id);
    const socket = getSocket();

    const handleUserUpdated = () => {
      refetch();
      Toast.show({
        type: "info",
        text1: "Profile Updated",
        text2: "Your profile was updated elsewhere.",
      });
    };

    socket?.on("userUpdated", handleUserUpdated);

    return () => {
      socket?.off("userUpdated", handleUserUpdated);
      if (socket?.connected) socket.disconnect();
    };
  }, [token, user?._id]);

  return (
    <UserContext.Provider
      value={{
        storeToken,
        logout,
        token,
        language,
        setLanguage,
        isEnabled,
        setIsEnabled,
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

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
