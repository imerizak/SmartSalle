import { useTranslation } from 'react-i18next';
import { useCallback } from 'react';

export function useLanguage() {
  const { i18n } = useTranslation();

  const isRTL = i18n.language === 'ar';
  const currentLanguage = i18n.language;

  const changeLanguage = useCallback((language) => {
    const direction = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.dir = direction;
    document.documentElement.lang = language;
    i18n.changeLanguage(language);
    localStorage.setItem('language', language);
  }, [i18n]);

  return {
    isRTL,
    currentLanguage,
    changeLanguage
  };
}
