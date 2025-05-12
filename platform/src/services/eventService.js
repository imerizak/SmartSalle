import apiClient from "./apiClient";

const BASE_URL = "/events";

export const eventService = {
  getAllEvents: (params) => {
    // params can include status, type, startDate, endDate, page, size
    return apiClient.get(BASE_URL, params);
  },
  getEventById: (id) => {
    return apiClient.get(`${BASE_URL}/${id}`);
  },
  createEvent: (eventData, instructorId) => {
    // Backend expects Event object and optional instructorId query param
    let url = BASE_URL;
    if (instructorId) {
      url += `?instructorId=${instructorId}`;
    }
    return apiClient.post(url, eventData);
  },
  updateEvent: (id, eventData, instructorId) => {
    let url = `${BASE_URL}/${id}`;
    if (instructorId) {
      url += `?instructorId=${instructorId}`;
    }
    return apiClient.put(url, eventData);
  },
  deleteEvent: (id) => {
    return apiClient.delete(`${BASE_URL}/${id}`);
  },
  registerForEvent: (eventId) => {
    // memberId will be extracted from JWT by the backend
    return apiClient.post(`${BASE_URL}/${eventId}/register`, {});
  },
  unregisterFromEvent: (eventId) => {
    // memberId will be extracted from JWT by the backend
    return apiClient.delete(`${BASE_URL}/${eventId}/unregister`);
  },
  getEventRegistrations: (eventId) => {
    return apiClient.get(`${BASE_URL}/${eventId}/registrations`);
  },
};

