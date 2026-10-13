import { getLocales } from 'expo-localization';
import { createInstance } from 'i18next';
import { initReactI18next, useTranslation } from 'react-i18next';
import { DINO_NAMES } from './dinoNames';
import en from './en';
import es from './es';

export type Language = 'es' | 'en';

export function deviceLanguage(): Language {
  return getLocales()[0]?.languageCode === 'es' ? 'es' : 'en';
}

const i18n = createInstance();

void i18n.use(initReactI18next).init({
  resources: { es: { translation: es }, en: { translation: en } },
  lng: deviceLanguage(),
  fallbackLng: 'es',
  interpolation: { escapeValue: false },
  returnNull: false,
});

export function setLanguage(language: Language | null) {
  const target = language ?? deviceLanguage();
  if (i18n.language !== target) void i18n.changeLanguage(target);
}

export function currentLanguage(): Language {
  return i18n.language === 'en' ? 'en' : 'es';
}

export function dinoName(id: string): string {
  return DINO_NAMES[currentLanguage()][id] ?? id;
}

export { useTranslation };
export default i18n;
