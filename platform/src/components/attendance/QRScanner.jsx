import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FiX } from 'react-icons/fi';

export default function QRScanner({ onClose, onScan }) {
  const { t } = useTranslation();

  useEffect(() => {
    // Mock QR scanning - in real app, implement actual QR scanning
    const timer = setTimeout(() => {
      onScan('MEM001');
    }, 2000);

    return () => clearTimeout(timer);
  }, [onScan]);

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
          {t('attendance.scanQRCode')}
        </h2>

        <div className="aspect-square bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-pulse mb-2">
              <div className="w-16 h-16 mx-auto border-4 border-primary rounded-lg"></div>
            </div>
            <p className="text-gray-500">{t('attendance.scanningQR')}</p>
          </div>
        </div>

        <p className="text-sm text-gray-500 text-center">
          {t('attendance.scanInstructions')}
        </p>
      </div>
    </div>
  );
}
