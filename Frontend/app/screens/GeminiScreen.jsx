import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import React, { useState, useRef, useEffect } from "react";
import ChatInput from "../components/ChatInput";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/context/ThemeContext";
import axios from "axios";
import Toast from "react-native-toast-message";
import TypingIndicator from "@/app/components/TypingIndicator";
import { useLanguage } from "@/context/LanguageContexts";
import baseUrl from "@/baseUrl/baseUrl";
import Colors from "../constants/Colors";

export default function GeminiScreen() {
  const { t } = useTranslation();
  const { isDarkMode } = useTheme();
  const [userPrompt, setPrompt] = useState("");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const { language } = useLanguage();
  const scrollViewRef = useRef(null);

  // Scroll to bottom every time messages change
  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  const sendPromptToGemini = async () => {
    if (!userPrompt.trim()) return;

    try {
      setMessages((prev) => [...prev, { role: "user", text: userPrompt }]);
      setIsTyping(true); // Set typing indicator visible

      const res = await axios.post(`${baseUrl}/api/gemini/ask`, {
        prompt: userPrompt,
        language: language,
      });

      const { response } = res.data;

      setMessages((prev) => [...prev, { role: "assistant", text: response }]);
      setPrompt(""); // Clear prompt after sending
    } catch (err) {
      console.log("Error talking to Gemini backend:", err.message);
      Toast.show({
        type: "error",
        text1: "Unreachable",
        text2: "Could not reach Gemini service",
      });
    } finally {
      setIsLoading(false);
      setIsTyping(false); // Stop typing indicator once response is received
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1 }}
    >
      <View
        style={[
          styles.container,
          {
            backgroundColor: isDarkMode
              ? Colors.darkTheme.backgroundColor
              : Colors.lightTheme.backgroundColor,
          },
        ]}
      >
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={{ paddingBottom: 100 }}
          style={{ flex: 1, width: "100%" }}
        >
          {messages.map((msg, index) => (
            <View key={index} style={{ marginBottom: 10 }}>
              <Text
                style={{
                  alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
                  backgroundColor: msg.role === "user" ? "#a3e635" : "#e0e7ff",
                  marginVertical: 4,
                  padding: 8,
                  borderRadius: 6,
                  maxWidth: "80%",
                }}
              >
                {msg.text}
              </Text>
              {msg.role === "assistant" && isTyping && (
                <TypingIndicator visible={isTyping} />
              )}
            </View>
          ))}
        </ScrollView>

        <ChatInput
          placeholder={t("ask_abbabiyo")}
          onSend={() => {
            sendPromptToGemini(); // Call the sendPromptToGemini function
            setPrompt(""); // Clear the prompt after sending
          }}
          customStyle={{ position: "absolute", bottom: 20 }}
          value={userPrompt}
          onChangeText={setPrompt}
          isLoading={isLoading}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 10,
  },
});
