import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// Define your translations here
import en from "./locales/en.json";
import am from "./locales/am.json";
import om from "./locales/om.json";

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    am: { translation: am },
    om: { translation: om },
  },
  lng: "en", // Default language
  fallbackLng: "en", // Fallback language if the current language is not available
  interpolation: {
    escapeValue: false, // React already escapes XSS
  },
});

export default i18n;
