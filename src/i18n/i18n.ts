import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import ar from './locales/ar.json';
import en from './locales/en.json';

export const SUPPORTED_LANGUAGES = [
  { code: 'ar', label: 'AR' },
  { code: 'en', label: 'EN' },
] as const;

export type SupportedLanguageCode = (typeof SUPPORTED_LANGUAGES)[number]['code'];
const LANGUAGE_STORAGE_KEY = 'gem_lang';
const LANGUAGE_EXPLICIT_KEY = 'gem_lang_explicit';

const getInitialLanguage = (): SupportedLanguageCode => {
  if (typeof window === 'undefined') return 'ar';

  const isExplicitChoice = window.localStorage.getItem(LANGUAGE_EXPLICIT_KEY) === '1';
  if (!isExplicitChoice) return 'ar';

  const storedLanguage = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
  const isSupported = SUPPORTED_LANGUAGES.some((lng) => lng.code === storedLanguage);
  return isSupported ? (storedLanguage as SupportedLanguageCode) : 'ar';
};

i18n
  .use(initReactI18next)
  .init({
    // Keep namespaces simple for now.
    resources: {
      ar: { translation: ar },
      en: { translation: en },
    },
    lng: getInitialLanguage(),
    supportedLngs: SUPPORTED_LANGUAGES.map(l => l.code),
    nonExplicitSupportedLngs: true, // "en-US" -> "en"
    fallbackLng: ['ar', 'en'],
    interpolation: { escapeValue: false },
    react: {
      useSuspense: false,
    },
  });

export default i18n;
