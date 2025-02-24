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

  // Don't show regular navbar on dashboard
  if (location.pathname.includes('/dashboard')) {
    return null;
  }

  const navItems = !user ? [
    { href: "#features", label: t('nav.features') },
    { href: "#pricing", label: t('nav.pricing') },
    { href: "#contact", label: t('nav.contact') }
  ] : [];

  return (
    <nav className="bg-secondary text-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <Logo size="normal" />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-6">
            {/* Navigation Links */}
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-gray-300 hover:text-primary-light transition-colors"
              >
                {item.label}
              </a>
            ))}

            {/* Dashboard Link for logged-in users */}
            {user && (
              <Link 
                to="/dashboard" 
                className="text-gray-300 hover:text-primary-light transition-colors"
              >
                {t('nav.dashboard')}
              </Link>
            )}

            {/* Language Switcher */}
            <LanguageSwitcher />

            {/* Auth Button or Profile */}
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

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <LanguageSwitcher />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-300 hover:text-white hover:bg-secondary-light focus:outline-none"
            >
              {isOpen ? (
                <FiX className="block h-6 w-6" />
              ) : (
                <FiMenu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-secondary-light">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="block px-3 py-2 rounded-md text-gray-300 hover:text-white hover:bg-secondary-dark"
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </a>
            ))}
            
            {user ? (
              <>
                <Link 
                  to="/dashboard" 
                  className="block px-3 py-2 rounded-md text-gray-300 hover:text-white hover:bg-secondary-dark"
                  onClick={() => setIsOpen(false)}
                >
                  {t('nav.dashboard')}
                </Link>
                <div className="px-3 py-2">
                  <ProfileDropdown />
                </div>
              </>
            ) : (
              <button 
                onClick={() => {
                  setShowAuthModal(true);
                  setIsOpen(false);
                }}
                className="w-full mt-2 bg-gradient-primary text-secondary px-3 py-2 rounded-md hover:opacity-90 transition-opacity font-medium"
              >
                {t('nav.signIn')}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </nav>
  );
}
