import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { FiX, FiAlertCircle } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { validatePassword } from '../utils/passwordValidator';
import PasswordStrengthIndicator from './PasswordStrengthIndicator';
import { useNavigate } from 'react-router-dom';

export default function AuthModal({ isOpen, onClose, mode = 'signin' }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [organization, setOrganization] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [authMode, setAuthMode] = useState(mode);
  const { signIn, signUp } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (authMode === 'signup') {
        const { isValid, errors } = validatePassword(password);
        if (!isValid) {
          throw new Error(t('auth.passwordRequirements'));
        }

        const { error, data } = await signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
              organization: organization
            }
          }
        });

        if (error) throw error;

        toast.success(t('auth.verifyEmail'), {
          duration: 6000,
          icon: '📧'
        });
        onClose();
      } else {
        const { error, data } = await signIn({ email, password });
        if (error) throw error;
        
        toast.success(t('auth.signInSuccess'));
        onClose();
        navigate('/dashboard');
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6 relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <FiX size={24} />
        </button>

        <h2 className="text-2xl font-bold mb-6">
          {authMode === 'signin' ? t('auth.signIn') : t('auth.signUp')}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {authMode === 'signup' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('auth.fullName')}
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder={t('auth.fullNamePlaceholder')}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('auth.organization')}
                </label>
                <input
                  type="text"
                  required
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder={t('auth.organizationPlaceholder')}
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('auth.email')}
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('auth.password')}
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {authMode === 'signup' && <PasswordStrengthIndicator password={password} />}
          </div>

          {authMode === 'signup' && (
            <div className="bg-blue-50 p-3 rounded-md flex items-start space-x-2">
              <FiAlertCircle className="text-blue-500 mt-1 flex-shrink-0" />
              <p className="text-sm text-blue-700">
                {t('auth.emailVerificationNote')}
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary text-white py-2 rounded-md hover:bg-secondary transition-colors disabled:opacity-50"
          >
            {isLoading 
              ? t('auth.loading')
              : authMode === 'signin' ? t('auth.signIn') : t('auth.signUp')
            }
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            onClick={() => {
              setAuthMode(authMode === 'signin' ? 'signup' : 'signin');
              setPassword('');
              setFullName('');
              setOrganization('');
            }}
            className="text-primary hover:text-secondary"
          >
            {authMode === 'signin' ? t('auth.needAccount') : t('auth.haveAccount')}
          </button>
        </div>
      </div>
    </div>
  );
}
