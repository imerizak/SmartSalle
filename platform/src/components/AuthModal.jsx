import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { FiX, FiAlertCircle, FiAlertTriangle } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { validatePassword } from '../utils/passwordValidator';
import { logAuthError, getErrorMessage } from '../utils/errorLogger';
import PasswordStrengthIndicator from './PasswordStrengthIndicator';
import { useNavigate } from 'react-router-dom';

export default function AuthModal({ isOpen, onClose, mode = 'signin' }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [organization, setOrganization] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [authMode, setAuthMode] = useState(mode);
  const [error, setError] = useState('');
  const { signIn, signUp } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (authMode === 'signup') {
        const { isValid, errors } = validatePassword(password);
        if (!isValid) {
          const validationError = new Error(t('auth.passwordRequirements'));
          validationError.code = 'auth/weak-password';
          throw validationError;
        }

        const { error: signUpError, data } = await signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
              organization: organization
            }
          }
        });

        if (signUpError) throw signUpError;

        // Log successful signup
        console.log('✅ Signup successful:', {
          timestamp: new Date().toISOString(),
          email,
          organization
        });

        toast.success(t('auth.verifyEmail'), {
          duration: 6000,
          icon: '📧'
        });
        onClose();
      } else {
        const { error: signInError, data } = await signIn({ email, password });
        if (signInError) throw signInError;
        
        // Log successful login
        console.log('✅ Login successful:', {
          timestamp: new Date().toISOString(),
          email,
          userId: data?.user?.id
        });

        toast.success(t('auth.signInSuccess'));
        onClose();
        navigate('/dashboard');
      }
    } catch (error) {
      // Log the error with context
      const errorDetails = logAuthError(error, {
        mode: authMode,
        email,
        timestamp: new Date().toISOString()
      });

      // Set translated error message
      const errorMessage = t(getErrorMessage(error));
      setError(errorMessage);

      // Show error toast for network errors
      if (error.code === 'auth/network-request-failed') {
        toast.error(t('auth.errors.networkError'));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setFullName('');
    setOrganization('');
    setError('');
  };

  return (
    <div className="text-black fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6 relative">
        <button 
          onClick={() => {
            onClose();
            resetForm();
          }}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <FiX size={24} />
        </button>

        <h2 className="text-2xl font-bold mb-6">
          {authMode === 'signin' ? t('auth.signIn') : t('auth.signUp')}
        </h2>

        {error && (
          <div className="mb-4 p-3 rounded-md bg-red-50 text-red-700 flex items-start gap-2">
            <FiAlertTriangle className="mt-0.5 flex-shrink-0" />
            <p className="text-sm">{error}</p>
          </div>
        )}

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
