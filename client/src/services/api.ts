const API_BASE_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api`;

// Types
interface UserData {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  driverLicense: string;
  licensePlate: string;
  userType: 'customer' | 'helper';
}

interface HelperData extends UserData {
  services: string[];
  experience: string;
  vehicleInfo: string;
}

interface RequestData {
  serviceType: 'tow' | 'fuel' | 'tire' | 'battery' | 'lockout' | 'other';
  description: string;
  location: {
    type: 'Point';
    coordinates: [number, number];
    address: string;
  };
  isUrgent: boolean;
  estimatedPrice: number;
  vehicle: string;
  status?: 'pending' | 'accepted' | 'inProgress' | 'completed' | 'cancelled';
}

interface APIError extends Error {
  status?: number;
  response?: any;
}

// Helper function to handle fetch responses
const handleResponse = async (response: Response) => {
  const data = await response.json();

  if (!response.ok) {
    const error = new Error(data.message || 'API request failed') as APIError;
    error.status = response.status;
    error.response = data;
    throw error;
  }

  return data;
};

// Helper function to include auth token in requests
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');

  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : '',
  };
};

// Auth API calls
export const authAPI = {
  login: async (email: string, password: string, userType: 'customer' | 'helper') => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, userType }),
    });

    return handleResponse(response);
  },

  register: async (userData: UserData | HelperData) => {
    // Add this logging
    console.log('Sending registration data:', {
      ...userData,
      password: '***hidden***'
    });

    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Registration failed');
    }
    return data;
  },
};

// User API calls
export const userAPI = {
  getProfile: async () => {
    const response = await fetch(`${API_BASE_URL}/users/profile`, {
      headers: getAuthHeaders(),
    });

    return handleResponse(response);
  },

  getRequestHistory: async () => {
    const response = await fetch(`${API_BASE_URL}/users/requests`, {
      headers: getAuthHeaders(),
    });

    return handleResponse(response);
  },
};

// Helper API calls
export const helperAPI = {
  updateAvailability: async (isAvailable: boolean) => {
    const response = await fetch(`${API_BASE_URL}/helpers/availability`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ isAvailable }),
    });

    return handleResponse(response);
  },

  getEarnings: async () => {
    const response = await fetch(`${API_BASE_URL}/helpers/earnings`, {
      headers: getAuthHeaders(),
    });

    return handleResponse(response);
  },
};

// Request API calls
export const requestAPI = {
  createRequest: async (requestData: RequestData) => {
    const response = await fetch(`${API_BASE_URL}/requests`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(requestData),
    });

    return handleResponse(response);
  },

  getUserRequests: async () => {
    const response = await fetch(`${API_BASE_URL}/requests/user`, {
      headers: getAuthHeaders(),
    });

    return handleResponse(response);
  },

  getHelperRequests: async () => {
    const response = await fetch(`${API_BASE_URL}/requests/helper`, {
      headers: getAuthHeaders(),
    });

    return handleResponse(response);
  },

  getAvailableRequests: async () => {
    const response = await fetch(`${API_BASE_URL}/requests/available`, {
      headers: getAuthHeaders(),
    });

    return handleResponse(response);
  },

  getRequestById: async (requestId: string) => {
    const response = await fetch(`${API_BASE_URL}/requests/${requestId}`, {
      headers: getAuthHeaders(),
    });

    return handleResponse(response);
  },

  acceptRequest: async (requestId: string) => {
    const response = await fetch(`${API_BASE_URL}/requests/${requestId}/accept`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });

    return handleResponse(response);
  },

  updateRequestStatus: async (requestId: string, status: string, rating?: number, review?: string) => {
    const response = await fetch(`${API_BASE_URL}/requests/${requestId}/status`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status, rating, review }),
    });

    return handleResponse(response);
  },
};
