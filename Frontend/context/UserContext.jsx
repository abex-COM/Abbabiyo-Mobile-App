import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import Toast from "react-native-toast-message";
import { io } from "socket.io-client"; // Import socket.io-client
import baseUrl from "@/baseUrl/baseUrl";

const UserContext = createContext();

// Fetch user function
const fetchUser = async (token) => {
  try {
    const resp = await axios.get(`${baseUrl}/api/users/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return resp.data.user || [];
  } catch (error) {
    if (error.response) {
      Toast.show({
        type: "error",
        text1: "Failed while Fetching",
        text2: error?.response?.data?.message,
      });
    }
  }
};

export const UserProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [socket, setSocket] = useState(null);
  const [isEnabled, setIsEnabled] = useState(false);
  const [language, setLanguage] = useState("en");

  const {
    data: user = {},
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["user", token],
    queryFn: () => fetchUser(token),
    enabled: !!token,
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
    if (token && user?._id) {
      const newSocket = io(baseUrl, { transports: ["websocket"] });

      newSocket.on("connect", () => {
        console.log("Connected to WebSocket:", newSocket.id);
        newSocket.emit("authenticate", user._id); // Send user ID for authentication
      });

      // Listen for user updates from the backend
      newSocket.on("userUpdated", () => {
        console.log("User updated on another device, refetching...");
        refetch();
        Toast.show({
          type: "info",
          text1: "Profile Updated",
          text2: "Your profile was changed on another device.",
        });
      });

      setSocket(newSocket);

      // Cleanup socket connection when component unmounts or token changes
      return () => {
        newSocket.disconnect(); // Clean up socket on unmount
      };
    }
  }, [token, user?._id, refetch]);

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
