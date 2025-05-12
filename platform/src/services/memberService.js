import apiClient from "./apiClient";

const BASE_URL = "/members";

export const memberService = {
  getAllMembers: (params) => {
    return apiClient.get(BASE_URL, params);
  },
  getMemberById: (id) => {
    return apiClient.get(`${BASE_URL}/${id}`);
  },
  createMember: (memberData) => {
    // Le backend attend un objet User avec un rôle CLIENT
    // Le frontend envoie des données plus plates, il faut adapter.
    const userData = {
        firstname: memberData.name.split(" ")[0] || "N/A", // Simplification
        lastname: memberData.name.split(" ").slice(1).join(" ") || "N/A",
        email: memberData.email,
        phone: memberData.phone,
        password: "Pa$$w0rd", // Mot de passe par défaut, à gérer mieux en production
        role: "CLIENT",
        // Les champs comme membership, status, joinDate sont gérés différemment
        // joinDate est souvent un `createdAt` automatique
        // membership pourrait être un ID vers une table Membership
        // status est aussi souvent géré par le backend
    };
    return apiClient.post(BASE_URL, userData);
  },
  updateMember: (id, memberData) => {
    const userData = {
        firstname: memberData.name.split(" ")[0] || "N/A",
        lastname: memberData.name.split(" ").slice(1).join(" ") || "N/A",
        email: memberData.email,
        phone: memberData.phone,
        role: "CLIENT", // Le rôle ne devrait pas changer ici
    };
    return apiClient.put(`${BASE_URL}/${id}`, userData);
  },
  deleteMember: (id) => {
    return apiClient.delete(`${BASE_URL}/${id}`);
  },
};

