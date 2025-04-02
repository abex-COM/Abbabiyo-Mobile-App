// context/LanguageContext.js

import React, { createContext, useContext, useState, useEffect } from "react";
// import { i18n } from "react-i18next"; // Import i18n to change language
import i18n from "@/i18n/i18n";
const LanguageContext = createContext();

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState("en"); // Default language (English)

  // Change language whenever the state is updated
  useEffect(() => {
    if (language) {
      i18n.changeLanguage(language); // Update i18next language
    }
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};
