import i18n from '../i18n';

export const getCurrentLanguage = () => {
  return i18n.language || 'en';
};

export const getLanguageDirection = () => {
  return i18n.language === 'ar' ? 'rtl' : 'ltr';
};

export const formatDate = (date, options = {}) => {
  const language = getCurrentLanguage();
  return new Date(date).toLocaleDateString(language, options);
};

export const formatTime = (date, options = {}) => {
  const language = getCurrentLanguage();
  return new Date(date).toLocaleTimeString(language, options);
};

export const formatNumber = (number, options = {}) => {
  const language = getCurrentLanguage();
  return new Intl.NumberFormat(language, options).format(number);
};

export const formatCurrency = (amount, currency = 'USD') => {
  const language = getCurrentLanguage();
  return new Intl.NumberFormat(language, {
    style: 'currency',
    currency: currency
  }).format(amount);
};

export const getRelativeTime = (date) => {
  const language = getCurrentLanguage();
  const rtf = new Intl.RelativeTimeFormat(language, { numeric: 'auto' });
  
  const DIVISIONS = [
    { amount: 60, name: 'seconds' },
    { amount: 60, name: 'minutes' },
    { amount: 24, name: 'hours' },
    { amount: 7, name: 'days' },
    { amount: 4.34524, name: 'weeks' },
    { amount: 12, name: 'months' },
    { amount: Number.POSITIVE_INFINITY, name: 'years' }
  ];

  const now = new Date();
  const timestamp = new Date(date).getTime();
  const difference = (timestamp - now.getTime()) / 1000;

  for (let i = 0; i <= DIVISIONS.length; i++) {
    const division = DIVISIONS[i];
    if (Math.abs(difference) < division.amount) {
      return rtf.format(Math.round(difference), division.name);
    }
    difference /= division.amount;
  }
};
