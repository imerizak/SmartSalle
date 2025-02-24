import { useTranslation } from 'react-i18next';
import Logo from './Logo';

export default function Hero() {
  const { t } = useTranslation();

  return (
    <div className="bg-secondary-dark text-white">
      <div className="max-w-7xl mx-auto px-4 py-20 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="flex justify-center mb-8">
            <Logo size="large" />
          </div>
          <h1 className="text-4xl tracking-tight font-extrabold sm:text-5xl md:text-6xl">
            <span className="block">{t('hero.title1', 'Manage Your Gym')}</span>
            <span className="block gradient-text">{t('hero.title2', 'Like Never Before')}</span>
          </h1>
        </div>
      </div>
    </div>
  );
}
