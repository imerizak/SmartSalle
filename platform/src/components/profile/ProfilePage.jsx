import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import { FiUser, FiMail, FiPhone, FiLock, FiCamera, FiArrowLeft } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const { t } = useTranslation();
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    full_name: user?.user_metadata?.full_name || '',
    phone: user?.user_metadata?.phone || '',
    organization: user?.user_metadata?.organization || '',
    avatar_url: user?.user_metadata?.avatar_url || 'https://i.pravatar.cc/150'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProfile({
        data: formData
      });
      toast.success(t('profile.updateSuccess'));
      setIsEditing(false);
    } catch (error) {
      toast.error(t('profile.updateError'));
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, avatar_url: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Link 
              to="/dashboard"
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <FiArrowLeft className="w-5 h-5" />
              <span className="ml-2">{t('common.backToDashboard')}</span>
            </Link>
            <h1 className="text-2xl font-semibold text-gray-900">
              {t('profile.title')}
            </h1>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            {/* Profile Header */}
            <div className="flex flex-col items-center mb-8">
              <div className="relative">
                <div className="w-32 h-32 rounded-full overflow-hidden">
                  <img
                    src={formData.avatar_url}
                    alt={formData.full_name}
                    className="w-full h-full object-cover"
                  />
                </div>
                {isEditing && (
                  <label className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full cursor-pointer hover:bg-primary-dark transition-colors">
                    <FiCamera className="w-5 h-5" />
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                  </label>
                )}
              </div>
              <h2 className="mt-4 text-xl font-semibold text-gray-900">
                {formData.full_name}
              </h2>
              <p className="text-gray-500">{user.email}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('profile.fullName')}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiUser className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      disabled={!isEditing}
                      value={formData.full_name}
                      onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                      className={`w-full pl-10 pr-4 py-2 border rounded-md ${
                        isEditing 
                          ? 'border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent' 
                          : 'border-transparent bg-gray-50'
                      }`}
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('profile.phone')}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiPhone className="text-gray-400" />
                    </div>
                    <input
                      type="tel"
                      disabled={!isEditing}
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className={`w-full pl-10 pr-4 py-2 border rounded-md ${
                        isEditing 
                          ? 'border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent' 
                          : 'border-transparent bg-gray-50'
                      }`}
                    />
                  </div>
                </div>

                {/* Organization */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('profile.organization')}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiLock className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      disabled={!isEditing}
                      value={formData.organization}
                      onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                      className={`w-full pl-10 pr-4 py-2 border rounded-md ${
                        isEditing 
                          ? 'border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent' 
                          : 'border-transparent bg-gray-50'
                      }`}
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                {isEditing ? (
                  <>
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      {t('common.cancel')}
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
                    >
                      {t('common.save')}
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
                  >
                    {t('profile.edit')}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
