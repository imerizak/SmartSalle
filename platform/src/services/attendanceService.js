import apiClient from "./apiClient";

const BASE_URL = "/attendance";

export const attendanceService = {
  getAllAttendanceRecords: (params) => {
    // params could include filters like date ranges, memberId, etc.
    return apiClient.get(BASE_URL, params);
  },
  checkIn: (checkInData) => {
    // checkInData should contain memberId or other identifier
    // The backend expects { "memberId": "someId" }
    return apiClient.post(`${BASE_URL}/check-in`, checkInData);
  },
  checkOut: (checkOutData) => {
    // checkOutData should contain memberId or other identifier
    // The backend expects { "memberId": "someId" }
    return apiClient.post(`${BASE_URL}/check-out`, checkOutData);
  },
  getAttendanceStats: () => {
    return apiClient.get(`${BASE_URL}/stats`);
  },
};

