import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { FiCalendar, FiPlus, FiSearch, FiX, FiEdit2, FiTrash2, FiUsers, FiClock, FiMapPin, FiLoader } from "react-icons/fi";
import EventModal from "./EventModal";
import toast from "react-hot-toast";
import { formatDistanceToNow } from "date-fns";
// import { requestNotificationPermission, sendNotification } from "../../utils/notifications"; // Notifications à gérer séparément
import { eventService } from "../../services/eventService"; // Importer le service

export default function EventsPanel() {
  const { t } = useTranslation();
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all"); // "all", "upcoming", "ongoing", "completed"
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (filterStatus !== "all") {
        params.status = filterStatus.toUpperCase(); // Le backend attend le statut en majuscules
      }
      // Ajouter d'autres filtres si le backend les supporte (type, dateRange, etc.)
      const data = await eventService.getAllEvents(params);
      // Adapter les données du backend (Page<Event>)
      // Event: id, title, description, startTime, durationMinutes, capacity, registeredCount, location, instructor (User), type, status
      const adaptedEvents = data.content.map(evt => ({
        id: evt.id,
        title: evt.title,
        description: evt.description,
        date: evt.startTime, // startTime est un LocalDateTime
        duration: evt.durationMinutes,
        capacity: evt.capacity,
        registered: evt.registeredCount || 0,
        location: evt.location,
        instructor: evt.instructor ? `${evt.instructor.firstname} ${evt.instructor.lastname}` : "N/A",
        type: evt.type ? evt.type.toLowerCase() : "class",
        status: evt.status ? evt.status.toLowerCase() : "upcoming",
      }));
      setEvents(adaptedEvents);
    } catch (err) {
      setError(err.message);
      toast.error(`${t("events.fetchError")}: ${err.message}`);
    }
    setLoading(false);
  }, [t, filterStatus]);

  useEffect(() => {
    fetchEvents();
    // requestNotificationPermission(); // Gérer les permissions de notification au chargement si nécessaire
  }, [fetchEvents]);

  const handleAddEvent = async (newEventData) => {
    setLoading(true);
    try {
      // newEventData vient du formulaire EventModal
      // eventService.createEvent attend l'objet event et un instructorId optionnel
      // Il faut s'assurer que newEventData a la bonne structure pour le backend
      // (title, description, startTime, durationMinutes, capacity, location, type, status)
      // L'instructorId doit être récupéré si un instructeur est sélectionné dans le modal.
      // Pour l'instant, on suppose que newEventData est prêt.
      // L'ID de l'instructeur doit être passé en paramètre si applicable.
      const instructorId = newEventData.instructorId; // Supposons que le modal le fournisse
      const eventToCreate = { ...newEventData };
      delete eventToCreate.instructorId; // Ne pas l'envoyer dans le corps si c'est un query param

      await eventService.createEvent(eventToCreate, instructorId);
      toast.success(t("events.addSuccess"));
      fetchEvents(); // Recharger
      // Gérer l'envoi de notifications si nécessaire
    } catch (err) {
      toast.error(`${t("events.addError")}: ${err.message}`);
    }
    setLoading(false);
    setIsModalOpen(false);
  };

  const handleEditEvent = async (updatedEventData) => {
    if (!editingEvent) return;
    setLoading(true);
    try {
      const instructorId = updatedEventData.instructorId;
      const eventToUpdate = { ...updatedEventData };
      delete eventToUpdate.instructorId;

      await eventService.updateEvent(editingEvent.id, eventToUpdate, instructorId);
      toast.success(t("events.updateSuccess"));
      fetchEvents(); // Recharger
      // Gérer l'envoi de notifications si nécessaire
    } catch (err) {
      toast.error(`${t("events.updateError")}: ${err.message}`);
    }
    setLoading(false);
    setIsModalOpen(false);
    setEditingEvent(null);
  };

  const handleDeleteEvent = async (id) => {
    if (window.confirm(t("events.deleteConfirm"))) {
      setLoading(true);
      try {
        await eventService.deleteEvent(id);
        toast.success(t("events.deleteSuccess"));
        fetchEvents(); // Recharger
        // Gérer l'envoi de notifications si nécessaire
      } catch (err) {
        toast.error(`${t("events.deleteError")}: ${err.message}`);
      }
      setLoading(false);
    }
  };
  
  // TODO: Implémenter la logique d'inscription/désinscription aux événements
  // const handleRegister = async (eventId) => { ... eventService.registerForEvent(eventId) ... }
  // const handleUnregister = async (eventId) => { ... eventService.unregisterFromEvent(eventId) ... }

  // Le filtrage par titre/description/instructeur est pour l'instant côté client.
  const filteredEventsClientSide = events.filter(event => {
    const matchesSearch = 
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (event.instructor && event.instructor.toLowerCase().includes(searchTerm.toLowerCase()));
    // Le filtre par statut est déjà géré par l'appel API (params.status)
    return matchesSearch;
  });

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">
            {t("events.title")}
          </h2>
          <p className="text-sm text-gray-500">
            {t("events.subtitle")}
          </p>
        </div>
        <button
          onClick={() => {
            // requestNotificationPermission(); // Déplacer si besoin
            setEditingEvent(null);
            setIsModalOpen(true);
          }}
          className="bg-gradient-primary text-secondary px-4 py-2 rounded-md hover:opacity-90 transition-opacity flex items-center gap-2"
        >
          <FiPlus className="w-5 h-5" />
          {t("events.addNew")}
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <input
              type="text"
              placeholder={t("events.search")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 pl-10 pr-4 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <FiX className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          {["all", "upcoming", "ongoing", "completed"].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-md ${
                filterStatus === status
                  ? "bg-primary text-white"
                  : "bg-white text-gray-600 hover:bg-gray-100"
              }`}
            >
              {t(`events.status.${status}`)}
            </button>
          ))}
        </div>
      </div>

      {/* Loading and Error States */}
      {loading && (
        <div className="flex justify-center items-center p-4">
          <FiLoader className="animate-spin text-primary text-3xl" />
          <p className="ml-2">{t("loading")}</p>
        </div>
      )}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">{t("error.title")} </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {/* Events Grid */}
      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEventsClientSide.map((event) => (
            <div key={event.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">{event.title}</h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditingEvent(event); // `event` a la structure adaptée
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

                <p className="text-gray-600 mb-4 line-clamp-2">{event.description}</p>

                <div className="space-y-2 text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <FiCalendar className="w-4 h-4" />
                    <span>{event.date ? new Date(event.date).toLocaleString() : "N/A"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiClock className="w-4 h-4" />
                    <span>{event.duration} {t("minutes")}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiMapPin className="w-4 h-4" />
                    <span>{event.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiUsers className="w-4 h-4" />
                    <span>{event.registered}/{event.capacity} {t("events.registered")}</span>
                  </div>
                  {event.instructor && (
                     <div className="flex items-center gap-2">
                        <FiStar className="w-4 h-4 text-yellow-500" /> {/* Placeholder icon for instructor */} 
                        <span>{event.instructor}</span>
                    </div>
                  )}
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    event.status === "upcoming" ? "bg-blue-100 text-blue-800" :
                    event.status === "ongoing" ? "bg-green-100 text-green-800" :
                    event.status === "completed" ? "bg-gray-100 text-gray-800" :
                    "bg-yellow-100 text-yellow-800" // Default or other statuses
                  }`}>
                    {t(`events.status.${event.status}`)}
                  </span>
                  <span className="text-sm text-gray-500">
                    {event.date ? formatDistanceToNow(new Date(event.date), { addSuffix: true }) : ""}
                  </span>
                </div>
                {/* TODO: Ajouter des boutons pour s'inscrire/se désinscrire */}
              </div>
            </div>
          ))}
        </div>
      )}

      <EventModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingEvent(null);
        }}
        onSubmit={(eventData) => {
          if (editingEvent) {
            handleEditEvent(eventData);
          } else {
            handleAddEvent(eventData);
          }
        }}
        event={editingEvent} // `editingEvent` a la structure attendue par le modal
      />
    </div>
  );
}

