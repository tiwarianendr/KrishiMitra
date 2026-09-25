import React, { createContext, useContext, useState } from "react";
import { translationsRegistry, enTranslations, LANGUAGES } from "../i18n/translations";
import type { TranslationStrings } from "../i18n/translations";
import { api } from "../services/api";

interface LanguageContextType {
  language: string;
  setLanguage: (lang: string) => void;
  t: TranslationStrings;
  availableLanguages: typeof LANGUAGES;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<string>(() => {
    return localStorage.getItem("krishimitra_lang") || "en";
  });

  const setLanguage = (newLang: string) => {
    setLanguageState(newLang);
    localStorage.setItem("krishimitra_lang", newLang);

    // Update backend profile if authenticated
    const token = localStorage.getItem("krishimitra_token");
    if (token) {
      api.updateProfile({ preferred_language: newLang }).catch(() => {
        // Silently continue if offline
      });
    }
  };

  const t = translationsRegistry[language] || enTranslations;

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, availableLanguages: LANGUAGES }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
