import { useLanguage } from '../hooks/useLanguage';

export default function RTLWrapper({ children }) {
  const { isRTL } = useLanguage();

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'} className={isRTL ? 'font-arabic' : 'font-sans'}>
      {children}
    </div>
  );
}
