import apiClient from "./apiClient";

const BASE_URL = "/payments";

export const paymentService = {
  getAllPayments: (params) => {
    // params can include memberId, status, startDate, endDate, page, size
    return apiClient.get(BASE_URL, params);
  },
  getPaymentById: (id) => {
    return apiClient.get(`${BASE_URL}/${id}`);
  },
  createPayment: (paymentData) => {
    // paymentData should match the PaymentRequest DTO in the backend
    // { userId, membershipId (optional), amount, paymentMethod, status (optional), dueDate (optional) }
    return apiClient.post(BASE_URL, paymentData);
  },
  updatePaymentStatus: (id, status) => {
    // Backend expects a Map<String, String> with a "status" key
    return apiClient.put(`${BASE_URL}/${id}/status`, { status });
  },
  getPaymentStats: () => {
    return apiClient.get(`${BASE_URL}/stats`);
  },
};

