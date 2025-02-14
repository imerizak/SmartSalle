import { useState } from 'react';
import { FiMenu, FiX } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import LanguageSwitcher from './LanguageSwitcher';
import AuthModal from './AuthModal';
import toast from 'react-hot-toast';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { t } = useTranslation();
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success(t('auth.signOutSuccess'));
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <>
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-primary">SmartSalle</span>
            </div>
            
            <div className="hidden md:flex items-center space-x-6">
              <a href="#features" className="text-gray-700 hover:text-primary">{t('nav.features')}</a>
              <a href="#pricing" className="text-gray-700 hover:text-primary">{t('nav.pricing')}</a>
              <a href="#contact" className="text-gray-700 hover:text-primary">{t('nav.contact')}</a>
              <LanguageSwitcher />
              {user ? (
                <button 
                  onClick={handleSignOut}
                  className="text-gray-700 hover:text-primary"
                >
                  {t('nav.signOut')}
                </button>
              ) : (
                <button 
                  onClick={() => setShowAuthModal(true)}
                  className="bg-primary text-white px-4 py-2 rounded-md hover:bg-secondary transition-colors"
                >
                  {t('nav.signIn')}
                </button>
              )}
            </div>

            <div className="md:hidden flex items-center gap-4">
              <LanguageSwitcher />
              <button onClick={() => setIsOpen(!isOpen)} className="text-gray-700">
                {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {isOpen && (
          <div className="md:hidden">
            <div className="px-4 pt-2 pb-3 space-y-3">
              <a href="#features" className="block text-gray-700 hover:text-primary">{t('nav.features')}</a>
              <a href="#pricing" className="block text-gray-700 hover:text-primary">{t('nav.pricing')}</a>
              <a href="#contact" className="block text-gray-700 hover:text-primary">{t('nav.contact')}</a>
              {user ? (
                <button 
                  onClick={handleSignOut}
                  className="w-full text-left text-gray-700 hover:text-primary"
                >
                  {t('nav.signOut')}
                </button>
              ) : (
                <button 
                  onClick={() => setShowAuthModal(true)}
                  className="w-full text-center bg-primary text-white px-4 py-2 rounded-md hover:bg-secondary transition-colors"
                >
                  {t('nav.signIn')}
                </button>
              )}
            </div>
          </div>
        )}
      </nav>

      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </>
  );
}
