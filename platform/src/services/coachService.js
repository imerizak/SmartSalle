import apiClient from "./apiClient";

const BASE_URL = "/coaches";

export const coachService = {
  getAllCoaches: (params) => {
    return apiClient.get(BASE_URL, params);
  },
  getCoachById: (id) => {
    return apiClient.get(`${BASE_URL}/${id}`);
  },
  createCoach: (coachData) => {
    // Le backend attend un objet User avec un rôle TRAINER
    // Le frontend envoie des données plus riches, il faut adapter.
    const userData = {
        firstname: coachData.name.split(" ")[0] || "N/A",
        lastname: coachData.name.split(" ").slice(1).join(" ") || "N/A",
        email: coachData.email,
        phone: coachData.phone,
        password: "Pa$$w0rd", // Mot de passe par défaut, à gérer mieux en production
        role: "TRAINER",
        // Les champs spécifiques au coach (specialties, experience, etc.)
        // devront être gérés par le backend, potentiellement dans une table liée ou des champs JSON.
        // Pour l'instant, on envoie les données de base de l'utilisateur.
        // Le backend CoachController/Service devra être capable de les traiter.
        // On peut aussi les passer dans un champ `profileData` ou similaire si le backend le supporte.
        profileData: {
            specialties: coachData.specialties,
            experience: coachData.experience,
            rating: coachData.rating,
            availability: coachData.availability,
            bio: coachData.bio,
            certifications: coachData.certifications,
            status: coachData.status,
            imageUrl: coachData.imageUrl
        }
    };
    return apiClient.post(BASE_URL, userData);
  },
  updateCoach: (id, coachData) => {
    const userData = {
        firstname: coachData.name.split(" ")[0] || "N/A",
        lastname: coachData.name.split(" ").slice(1).join(" ") || "N/A",
        email: coachData.email,
        phone: coachData.phone,
        role: "TRAINER",
        profileData: {
            specialties: coachData.specialties,
            experience: coachData.experience,
            rating: coachData.rating,
            availability: coachData.availability,
            bio: coachData.bio,
            certifications: coachData.certifications,
            status: coachData.status,
            imageUrl: coachData.imageUrl
        }
    };
    return apiClient.put(`${BASE_URL}/${id}`, userData);
  },
  deleteCoach: (id) => {
    return apiClient.delete(`${BASE_URL}/${id}`);
  },
};

