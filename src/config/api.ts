export const API_BASE_URL = 'http://localhost:5001/api';
export const FRONTEND_URL = 'http://localhost:8081';

export const API_ENDPOINTS = {
  auth: {
    login: `${API_BASE_URL}/auth/login`,
    register: `${API_BASE_URL}/auth/register`,
    validate: `${API_BASE_URL}/auth/validate`,
  },
  customer: {
    profile: `${API_BASE_URL}/users/profile`,
    requests: `${API_BASE_URL}/users/requests`,
    createRequest: `${API_BASE_URL}/requests`,
    getRequest: (id: string) => `${API_BASE_URL}/requests/${id}`,
    updateRequestStatus: (id: string) => `${API_BASE_URL}/requests/${id}/status`,
    myHistory: `${API_BASE_URL}/requests/history`,
  },
  helper: {
    profile: `${API_BASE_URL}/helpers/profile`,
    availability: `${API_BASE_URL}/helpers/availability`,
    availableRequests: `${API_BASE_URL}/requests/available`,
    myRequests: `${API_BASE_URL}/requests/helper`,
    myHistory: `${API_BASE_URL}/requests/history`,
    acceptRequest: (id: string) => `${API_BASE_URL}/requests/${id}/accept`,
    updateRequestStatus: (id: string) => `${API_BASE_URL}/requests/${id}/status`,
  },
  earnings: {
    summary: `${API_BASE_URL}/earnings/summary`,
    transactions: `${API_BASE_URL}/earnings/transactions`
  },
};