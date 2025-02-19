import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FiPlus, FiSearch, FiX, FiEdit2, FiTrash2, FiStar, FiPhone, FiMail, FiCalendar } from 'react-icons/fi';
import CoachModal from './CoachModal';
import toast from 'react-hot-toast';

// Mock data - replace with actual data from your backend
const mockCoaches = [
  {
    id: 1,
    name: 'John Smith',
    email: 'john.smith@example.com',
    phone: '+1234567890',
    specialties: ['Strength Training', 'CrossFit'],
    experience: 5,
    rating: 4.8,
    availability: ['Monday', 'Wednesday', 'Friday'],
    bio: 'Certified personal trainer with 5 years of experience in strength training and CrossFit.',
    certifications: ['NASM CPT', 'CrossFit Level 2'],
    status: 'active',
    imageUrl: 'https://i.pravatar.cc/150?img=1'
  },
  {
    id: 2,
    name: 'Sarah Johnson',
    email: 'sarah.j@example.com',
    phone: '+1234567891',
    specialties: ['Yoga', 'Pilates'],
    experience: 8,
    rating: 4.9,
    availability: ['Tuesday', 'Thursday', 'Saturday'],
    bio: 'Experienced yoga instructor specializing in vinyasa and restorative yoga.',
    certifications: ['RYT 200', 'Pilates Certification'],
    status: 'active',
    imageUrl: 'https://i.pravatar.cc/150?img=2'
  }
];

export default function CoachesPanel() {
  const { t } = useTranslation();
  const [coaches, setCoaches] = useState(mockCoaches);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCoach, setEditingCoach] = useState(null);
  const [filterSpecialty, setFilterSpecialty] = useState('all');

  const handleAddCoach = (newCoach) => {
    const coachWithId = { ...newCoach, id: Date.now() };
    setCoaches([...coaches, coachWithId]);
    toast.success(t('coaches.addSuccess'));
  };

  const handleEditCoach = (updatedCoach) => {
    setCoaches(coaches.map(coach => 
      coach.id === updatedCoach.id ? updatedCoach : coach
    ));
    toast.success(t('coaches.updateSuccess'));
  };

  const handleDeleteCoach = (id) => {
    if (window.confirm(t('coaches.deleteConfirm'))) {
      setCoaches(coaches.filter(coach => coach.id !== id));
      toast.success(t('coaches.deleteSuccess'));
    }
  };

  // Get unique specialties for filter
  const specialties = [...new Set(coaches.flatMap(coach => coach.specialties))];

  const filteredCoaches = coaches.filter(coach => {
    const matchesSearch = 
      coach.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coach.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coach.specialties.some(specialty => 
        specialty.toLowerCase().includes(searchTerm.toLowerCase())
      );
    
    const matchesSpecialty = filterSpecialty === 'all' || 
      coach.specialties.includes(filterSpecialty);

    return matchesSearch && matchesSpecialty;
  });

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">
            {t('coaches.title')}
          </h2>
          <p className="text-sm text-gray-500">
            {t('coaches.subtitle')}
          </p>
        </div>
        <button
          onClick={() => {
            setEditingCoach(null);
            setIsModalOpen(true);
          }}
          className="bg-gradient-primary text-secondary px-4 py-2 rounded-md hover:opacity-90 transition-opacity flex items-center gap-2"
        >
          <FiPlus className="w-5 h-5" />
          {t('coaches.addNew')}
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <input
              type="text"
              placeholder={t('coaches.search')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 pl-10 pr-4 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <FiX className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
        <div className="flex gap-2 overflow-x-auto">
          <button
            onClick={() => setFilterSpecialty('all')}
            className={`px-4 py-2 rounded-md whitespace-nowrap ${
              filterSpecialty === 'all' 
                ? 'bg-primary text-white' 
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            {t('coaches.allSpecialties')}
          </button>
          {specialties.map((specialty) => (
            <button
              key={specialty}
              onClick={() => setFilterSpecialty(specialty)}
              className={`px-4 py-2 rounded-md whitespace-nowrap ${
                filterSpecialty === specialty 
                  ? 'bg-primary text-white' 
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              {specialty}
            </button>
          ))}
        </div>
      </div>

      {/* Coaches Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCoaches.map((coach) => (
          <div key={coach.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="relative">
              <img 
                src={coach.imageUrl} 
                alt={coach.name}
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-2 right-2 flex gap-2">
                <button
                  onClick={() => {
                    setEditingCoach(coach);
                    setIsModalOpen(true);
                  }}
                  className="p-2 bg-white rounded-full shadow-md text-primary hover:text-primary-dark transition-colors"
                >
                  <FiEdit2 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDeleteCoach(coach.id)}
                  className="p-2 bg-white rounded-full shadow-md text-red-600 hover:text-red-700 transition-colors"
                >
                  <FiTrash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{coach.name}</h3>
                  <div className="flex items-center mt-1">
                    <FiStar className="w-5 h-5 text-yellow-400" />
                    <span className="ml-1 text-sm text-gray-600">{coach.rating}</span>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  coach.status === 'active' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {coach.status}
                </span>
              </div>

              <div className="space-y-2 text-sm text-gray-500 mb-4">
                <div className="flex items-center gap-2">
                  <FiMail className="w-4 h-4" />
                  <span>{coach.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FiPhone className="w-4 h-4" />
                  <span>{coach.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FiCalendar className="w-4 h-4" />
                  <span>{coach.availability.join(', ')}</span>
                </div>
              </div>

              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">
                  {t('coaches.specialties')}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {coach.specialties.map((specialty, index) => (
                    <span 
                      key={index}
                      className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">
                  {t('coaches.certifications')}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {coach.certifications.map((cert, index) => (
                    <span 
                      key={index}
                      className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium"
                    >
                      {cert}
                    </span>
                  ))}
                </div>
              </div>

              <p className="text-sm text-gray-600">{coach.bio}</p>
            </div>
          </div>
        ))}
      </div>

      <CoachModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingCoach(null);
        }}
        onSubmit={(coach) => {
          if (editingCoach) {
            handleEditCoach({ ...coach, id: editingCoach.id });
          } else {
            handleAddCoach(coach);
          }
          setIsModalOpen(false);
          setEditingCoach(null);
        }}
        coach={editingCoach}
      />
    </div>
  );
}
