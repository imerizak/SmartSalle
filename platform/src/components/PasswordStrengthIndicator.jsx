import { useTranslation } from 'react-i18next';
import { FiCheck, FiX } from 'react-icons/fi';

export default function PasswordStrengthIndicator({ password }) {
  const { t } = useTranslation();
  
  const requirements = [
    { key: 'minLength', test: pwd => pwd.length >= 8 },
    { key: 'upperCase', test: pwd => /[A-Z]/.test(pwd) },
    { key: 'lowerCase', test: pwd => /[a-z]/.test(pwd) },
    { key: 'number', test: pwd => /\d/.test(pwd) },
    { key: 'special', test: pwd => /[!@#$%^&*(),.?":{}|<>]/.test(pwd) }
  ];

  return (
    <div className="mt-2 space-y-2 text-sm">
      {requirements.map(({ key, test }) => (
        <div key={key} className="flex items-center space-x-2">
          {test(password) ? (
            <FiCheck className="text-green-500" />
          ) : (
            <FiX className="text-red-500" />
          )}
          <span className={test(password) ? 'text-green-500' : 'text-red-500'}>
            {t(`password.${key}`)}
          </span>
        </div>
      ))}
    </div>
  );
}
