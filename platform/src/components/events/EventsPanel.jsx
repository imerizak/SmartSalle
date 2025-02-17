import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FiCalendar, FiPlus, FiSearch, FiX, FiEdit2, FiTrash2, FiUsers, FiClock, FiMapPin } from 'react-icons/fi';
import EventModal from './EventModal';
import toast from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';
import { requestNotificationPermission, sendNotification } from '../../utils/notifications';

// Mock data - replace with actual data from your backend
const mockEvents = [
  {
    id: 1,
    title: 'Yoga Workshop',
    description: 'Beginner-friendly yoga session',
    date: '2024-03-20T10:00',
    duration: 60,
    capacity: 20,
    registered: 15,
    location: 'Studio A',
    instructor: 'Jane Smith',
    type: 'workshop',
    status: 'upcoming'
  },
  {
    id: 2,
    title: 'HIIT Challenge',
    description: 'High-intensity interval training',
    date: '2024-03-21T15:00',
    duration: 45,
    capacity: 15,
    registered: 10,
    location: 'Main Hall',
    instructor: 'John Doe',
    type: 'class',
    status: 'upcoming'
  }
];

export default function EventsPanel() {
  const { t } = useTranslation();
  const [events, setEvents] = useState(mockEvents);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');

  const handleAddEvent = async (newEvent) => {
    const eventWithId = { ...newEvent, id: Date.now() };
    setEvents([...events, eventWithId]);
    toast.success(t('events.addSuccess'));

    // Send notification to subscribed users
    try {
      await sendNotification({
        title: t('events.notifications.newEvent'),
        body: `${newEvent.title} - ${new Date(newEvent.date).toLocaleDateString()}`,
        icon: '/assets/logo.png',
        data: { eventId: eventWithId.id }
      });
    } catch (error) {
      console.error('Failed to send notification:', error);
    }
  };

  const handleEditEvent = async (updatedEvent) => {
    setEvents(events.map(event => 
      event.id === updatedEvent.id ? updatedEvent : event
    ));
    toast.success(t('events.updateSuccess'));

    // Notify registered participants about the change
    try {
      await sendNotification({
        title: t('events.notifications.eventUpdated'),
        body: `${updatedEvent.title} has been updated`,
        icon: '/assets/logo.png',
        data: { eventId: updatedEvent.id }
      });
    } catch (error) {
      console.error('Failed to send notification:', error);
    }
  };

  const handleDeleteEvent = async (id) => {
    if (window.confirm(t('events.deleteConfirm'))) {
      const eventToDelete = events.find(event => event.id === id);
      setEvents(events.filter(event => event.id !== id));
      toast.success(t('events.deleteSuccess'));

      // Notify registered participants about cancellation
      try {
        await sendNotification({
          title: t('events.notifications.eventCancelled'),
          body: `${eventToDelete.title} has been cancelled`,
          icon: '/assets/logo.png',
          data: { eventId: id }
        });
      } catch (error) {
        console.error('Failed to send notification:', error);
      }
    }
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = 
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.instructor.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || event.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">
            {t('events.title')}
          </h2>
          <p className="text-sm text-gray-500">
            {t('events.subtitle')}
          </p>
        </div>
        <button
          onClick={() => {
            requestNotificationPermission();
            setEditingEvent(null);
            setIsModalOpen(true);
          }}
          className="bg-gradient-primary text-secondary px-4 py-2 rounded-md hover:opacity-90 transition-opacity flex items-center gap-2"
        >
          <FiPlus className="w-5 h-5" />
          {t('events.addNew')}
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <input
              type="text"
              placeholder={t('events.search')}
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
        <div className="flex gap-2">
          {['all', 'upcoming', 'ongoing', 'completed'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-md ${
                filterStatus === status 
                  ? 'bg-primary text-white' 
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              {t(`events.status.${status}`)}
            </button>
          ))}
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.map((event) => (
          <div key={event.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{event.title}</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditingEvent(event);
                      setIsModalOpen(true);
                    }}
                    className="text-primary hover:text-primary-dark"
                  >
                    <FiEdit2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDeleteEvent(event.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <FiTrash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              <p className="text-gray-600 mb-4">{event.description}</p>
              
              <div className="space-y-2 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <FiCalendar className="w-4 h-4" />
                  <span>{new Date(event.date).toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FiClock className="w-4 h-4" />
                  <span>{event.duration} minutes</span>
                </div>
                <div className="flex items-center gap-2">
                  <FiMapPin className="w-4 h-4" />
                  <span>{event.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FiUsers className="w-4 h-4" />
                  <span>{event.registered}/{event.capacity} {t('events.registered')}</span>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  event.status === 'upcoming' ? 'bg-blue-100 text-blue-800' :
                  event.status === 'ongoing' ? 'bg-green-100 text-green-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {t(`events.status.${event.status}`)}
                </span>
                <span className="text-sm text-gray-500">
                  {formatDistanceToNow(new Date(event.date), { addSuffix: true })}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <EventModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingEvent(null);
        }}
        onSubmit={(event) => {
          if (editingEvent) {
            handleEditEvent({ ...event, id: editingEvent.id });
          } else {
            handleAddEvent(event);
          }
          setIsModalOpen(false);
          setEditingEvent(null);
        }}
        event={editingEvent}
      />
    </div>
  );
}
