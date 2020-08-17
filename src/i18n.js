import i18n from "i18next";
import { initReactI18next } from "react-i18next";

//import Backend from "i18next-xhr-backend";
import LanguageDetector from 'i18next-browser-languagedetector';

import translationEN from 'assets/locales/EN/translation.json';
import translationPL from 'assets/locales/PL/translation.json';

// the translations
const resources = {
  EN: {
    translation: translationEN
  },
  PL: {
    translation: translationPL
  }
};

i18n
  .use(LanguageDetector)
  //.use(Backend)
  .use(initReactI18next)
  .init({
    resources,
    lng: "EN",
    fallbackLng: 'EN',
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    }
  });

export default i18n;