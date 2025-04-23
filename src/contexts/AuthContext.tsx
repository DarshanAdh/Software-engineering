import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { API_ENDPOINTS } from '@/config/api';

interface User {
  id: string;
  fullName: string;
  email: string;
  userType: 'customer' | 'helper' | 'admin';
  isApproved?: boolean;
  role?: 'admin' | 'superadmin';
  permissions?: {
    approveHelpers: boolean;
    manageUsers: boolean;
    viewTransactions: boolean;
  };
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string, userType: 'customer' | 'helper' | 'admin') => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  approveHelper: (helperId: string) => Promise<void>;
  deleteUser: (userId: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

interface RegisterData {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  userType: 'customer' | 'helper' | 'admin';
  driverLicense?: string;
  licensePlate?: string;
  services?: string[];
  isApproved?: boolean;
  experience?: string;
  vehicleInfo?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');
        const userName = localStorage.getItem('userName');
        const userType = localStorage.getItem('userType') as 'customer' | 'helper' | 'admin';

        if (token && userId && userName && userType) {
          // Validate token with backend
          const response = await fetch(API_ENDPOINTS.auth.validate, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });

          if (response.ok) {
            try {
              const data = await response.json();
              // Create user object with base properties
              const userObj: User = {
                id: userId,
                fullName: userName,
                email: data.user?.email || '', // Try to get email from response or use empty string
                userType: data.user?.userType || userType
              };

              // Add helper-specific properties
              if (userObj.userType === 'helper' && data.user?.isApproved !== undefined) {
                userObj.isApproved = data.user.isApproved;
              }

              // Add admin-specific properties
              if (userObj.userType === 'admin' && data.user) {
                if (data.user.role) {
                  userObj.role = data.user.role;
                }
                if (data.user.permissions) {
                  userObj.permissions = data.user.permissions;
                }
              }

              setUser(userObj);
              setIsAuthenticated(true);
            } catch (e) {
              // If we can't parse the JSON, still authenticate the user with stored data
              const fallbackUser: User = {
                id: userId,
                fullName: userName,
                email: '', // Not stored in localStorage for security
                userType: userType as 'customer' | 'helper' | 'admin'
              };

              setUser(fallbackUser);
              setIsAuthenticated(true);
            }
          } else {
            // Token invalid, clear storage
            localStorage.clear();
            // Don't show error toast during initial load
            // toast.error('Your session has expired. Please log in again.');
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        localStorage.clear();
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string, userType: 'customer' | 'helper' | 'admin') => {
    setLoading(true);
    try {
      // Use the API for all logins (customer, helper, and admin)
      const response = await fetch(API_ENDPOINTS.auth.login, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password, userType }),
      });

      if (response.ok) {
        let data;
        try {
          data = await response.json();
        } catch (e) {
          throw new Error('Invalid response from server');
        }
        localStorage.setItem('token', data.token);
        localStorage.setItem('userId', data.user.id);
        localStorage.setItem('userName', data.user.fullName);
        localStorage.setItem('userType', data.user.userType);

        // Create user object with base properties
        const userObj: User = {
          id: data.user.id,
          fullName: data.user.fullName,
          email: data.user.email,
          userType: data.user.userType
        };

        // Add helper-specific properties
        if (data.user.userType === 'helper' && data.user.isApproved !== undefined) {
          userObj.isApproved = data.user.isApproved;
        }

        // Add admin-specific properties
        if (data.user.userType === 'admin') {
          if (data.user.role) {
            userObj.role = data.user.role;
          }
          if (data.user.permissions) {
            userObj.permissions = data.user.permissions;
          }
        }

        setUser(userObj);
        setIsAuthenticated(true);

        toast.success('Login successful!');
        // Redirect based on user type
        if (data.user.userType === 'admin') {
          navigate('/admin-dashboard');
        } else if (data.user.userType === 'helper') {
          // Check if helper is approved
          if (data.user.isApproved) {
            navigate('/helper-dashboard');
          } else {
            toast.warning('Your account is pending approval by an administrator.');
            navigate('/pending-approval');
          }
        } else {
          navigate('/dashboard');
        }
      } else {
        // Handle non-OK responses
        if (response.status === 429) {
          toast.error('Too many login attempts. Please try again later.');
        } else {
          try {
            const errorData = await response.json();
            toast.error(errorData.message || 'Login failed');
          } catch (e) {
            // If we can't parse the JSON, just use the status text
            toast.error(`Login failed: ${response.statusText}`);
          }
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error instanceof Error ? error.message : 'An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: RegisterData) => {
    setLoading(true);
    try {
      const response = await fetch(API_ENDPOINTS.auth.register, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        let data;
        try {
          data = await response.json();
        } catch (e) {
          throw new Error('Invalid response from server');
        }
        toast.success('Registration successful! Please log in.');
        navigate('/login');
      } else {
        // Handle non-OK responses
        if (response.status === 429) {
          toast.error('Too many registration attempts. Please try again later.');
        } else {
          try {
            const errorData = await response.json();
            toast.error(errorData.message || 'Registration failed');
          } catch (e) {
            // If we can't parse the JSON, just use the status text
            toast.error(`Registration failed: ${response.statusText}`);
          }
        }
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast.error(error instanceof Error ? error.message : 'An error occurred during registration');
    } finally {
      setLoading(false);
    }
  };

  const approveHelper = async (helperId: string) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_ENDPOINTS.admin.approveHelper}/${helperId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        toast.success('Helper approved successfully');
        return true;
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Failed to approve helper');
        return false;
      }
    } catch (error) {
      console.error('Approve helper error:', error);
      toast.error('An error occurred while approving the helper');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (userId: string) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_ENDPOINTS.admin.deleteUser}/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        toast.success('User deleted successfully');
        return true;
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Failed to delete user');
        return false;
      }
    } catch (error) {
      console.error('Delete user error:', error);
      toast.error('An error occurred while deleting the user');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
    setIsAuthenticated(false);
    navigate('/');
    toast.success('Logged out successfully');
  };

  const contextValue: AuthContextType = {
    user,
    loading,
    login,
    register,
    approveHelper,
    deleteUser,
    logout,
    isAuthenticated,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};


