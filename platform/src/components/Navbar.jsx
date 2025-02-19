import { useState } from 'react';
import { FiMenu, FiX } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { useLocation, Link } from 'react-router-dom';
import LanguageSwitcher from './LanguageSwitcher';
import AuthModal from './AuthModal';
import Logo from './Logo';
import ProfileDropdown from './profile/ProfileDropdown';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { t } = useTranslation();
  const { user } = useAuth();
  const location = useLocation();
  const isDashboard = location.pathname.includes('/dashboard');

  // Don't show regular navbar on dashboard
  if (isDashboard) return null;

  return (
    <nav className="bg-secondary text-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <Logo size="normal" />
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-6">
            {!user && (
              <>
                <a href="#features" className="text-gray-300 hover:text-primary-light transition-colors">{t('nav.features')}</a>
                <a href="#pricing" className="text-gray-300 hover:text-primary-light transition-colors">{t('nav.pricing')}</a>
                <a href="#contact" className="text-gray-300 hover:text-primary-light transition-colors">{t('nav.contact')}</a>
              </>
            )}
            {user && (
              <Link 
                to="/dashboard" 
                className="text-gray-300 hover:text-primary-light transition-colors"
              >
                {t('nav.dashboard')}
              </Link>
            )}
            <LanguageSwitcher />
            {user ? (
              <ProfileDropdown />
            ) : (
              <button 
                onClick={() => setShowAuthModal(true)}
                className="bg-gradient-primary text-secondary px-6 py-2 rounded-md hover:opacity-90 transition-opacity font-medium"
              >
                {t('nav.signIn')}
              </button>
            )}
          </div>

          <div className="md:hidden flex items-center gap-4">
            <LanguageSwitcher />
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-300">
              {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-secondary-light">
          <div className="px-4 pt-2 pb-3 space-y-3">
            {!user && (
              <>
                <a href="#features" className="block text-gray-300 hover:text-primary-light">{t('nav.features')}</a>
                <a href="#pricing" className="block text-gray-300 hover:text-primary-light">{t('nav.pricing')}</a>
                <a href="#contact" className="block text-gray-300 hover:text-primary-light">{t('nav.contact')}</a>
              </>
            )}
            {user && (
              <Link 
                to="/dashboard" 
                className="block text-gray-300 hover:text-primary-light"
              >
                {t('nav.dashboard')}
              </Link>
            )}
            {user ? (
              <div className="py-2">
                <ProfileDropdown />
              </div>
            ) : (
              <button 
                onClick={() => setShowAuthModal(true)}
                className="w-full bg-gradient-primary text-secondary px-4 py-2 rounded-md hover:opacity-90 transition-opacity font-medium"
              >
                {t('nav.signIn')}
              </button>
            )}
          </div>
        </div>
      )}

      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </nav>
  );
}
