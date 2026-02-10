import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import translationJA from "./locales/ja/translation.json";
import translationEN from "./locales/en/translation.json";
import translationVI from "./locales/vi/translation.json";

const resources = {
  ja: {
    translation: translationJA,
  },
  en: {
    translation: translationEN,
  },
  vi: {
    translation: translationVI,
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: "ja", // Always start with Japanese on server
  fallbackLng: "ja",
  interpolation: { escapeValue: false },
  react: {
    useSuspense: false, // Disable suspense to avoid hydration issues
  },
});

// Initialize client-side language after hydration
if (typeof window !== "undefined") {
  const savedLanguage = localStorage.getItem("language");
  const browserLanguage = navigator.language.split("-")[0];
  const clientLanguage =
    savedLanguage ||
    (resources[browserLanguage as keyof typeof resources]
      ? browserLanguage
      : "ja");
  
  if (clientLanguage !== i18n.language) {
    i18n.changeLanguage(clientLanguage);
  }
}

// Save language preference when changed
i18n.on("languageChanged", (lng) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("language", lng);
  }
});

export default i18n;
