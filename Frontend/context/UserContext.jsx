import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import Toast from "react-native-toast-message";
import { io } from "socket.io-client"; // Import socket.io-client
import baseUrl from "@/baseUrl/baseUrl";
import { useNavigation } from "expo-router";
import { getSocket, initiateSocketConnection } from "@/app/utils/socket";

const UserContext = createContext();

// Fetch user function
const fetchUser = async (token) => {
  try {
    const resp = await axios.get(`${baseUrl}/api/users/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return resp.data.user || [];
  } catch (error) {
    // if (error.response) {
    //   Toast.show({
    //     type: "error",
    //     text1: "Failed while Fetching",
    //     text2: error?.response?.data?.message,
    //   });
    // }
    throw error; // This will trigger `onError` inside useQuery
  }
};

export const UserProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [socket, setSocket] = useState(null);
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
          text2: "Your session has expired or account was deleted.",
        });
        logout();
      } else {
        Toast.show({
          type: "error",
          text1: "Error fetching user",
          text2: error?.response?.data?.message || "Something went wrong",
        });
      }
    },
  });
  // Function to store token
  const storeToken = async (token) => {
    try {
      await AsyncStorage.setItem("token", token);
      setToken(token);
    } catch (err) {
      console.log(err);
    }
  };

  // Function to log out
  const logout = async () => {
    try {
      await AsyncStorage.removeItem("token");

      setToken(null);
      navigation.reset({
        index: 0,
        routes: [{ name: "welcomeScreen" }],
      });
      console.log("logged out");

      if (socket) socket.disconnect(); // Disconnect socket on logout
    } catch (error) {
      console.log(error);
    }
  };

  // Fetch token from AsyncStorage on mount
  useEffect(() => {
    const fetchToken = async () => {
      const storedToken = await AsyncStorage.getItem("token");
      if (storedToken) setToken(storedToken);
    };
    fetchToken();
  }, []);

  // Initialize WebSocket when token is set
  useEffect(() => {
    initiateSocketConnection(user._id); // Initialize connection
    const socket = getSocket();

    const handleUserUpdated = () => {
      refetch();
      Toast.show({
        type: "info",
        text1: "Profile Updated",
        text2: "Your profile was changed on another device.",
      });
    };

    socket.on("userUpdated", handleUserUpdated);

    return () => {
      socket.off("userUpdated", handleUserUpdated); // Remove only this listener
      if (socket.connected) {
        socket.disconnect(); // Disconnect only if connected
      }
    };
  }, [token, user._id, refetch]);

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

// Custom hook for accessing UserContext
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("UserContext must be used within a UserProvider");
  }
  return context;
};
