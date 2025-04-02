import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin } from 'lucide-react';
import { API_ENDPOINTS } from '@/config/api';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

// Interface matching MongoDB Request Schema
interface Request {
  _id: string;
  user: {
    _id: string;
    fullName: string;
    phone: string;
  };
  serviceType: 'tire' | 'battery' | 'lockout' | 'fuel' | 'other' | 'tow';
  description: string;
  location: {
    type: 'Point';
    coordinates: [number, number];
    address: string;
  };
  status: 'pending' | 'accepted' | 'inProgress' | 'completed' | 'cancelled';
  helper?: {
    _id: string;
    fullName: string;
    phone: string;
  };
  estimatedPrice: number;
  isUrgent: boolean;
  vehicle: string;
  createdAt: string;
  acceptedAt?: string;
  startedAt?: string;
  completedAt?: string;
  cancelledAt?: string;
  rating?: number;
  review?: string;
}

const Dashboard = () => {
  const [requests, setRequests] = useState<Request[]>([]);
  const [activeRequests, setActiveRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();

  // Redirect to helper dashboard if user is a helper
  useEffect(() => {
    if (user?.userType === 'helper') {
      navigate('/helper-dashboard');
    }
  }, [user, navigate]);

  // Fetch all requests and set up WebSocket
  useEffect(() => {
    fetchRequests();
    setupWebSocket();

    const interval = setInterval(fetchRequests, 30000); // Poll every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const setupWebSocket = () => {
    const ws = new WebSocket('ws://localhost:5001/ws');

    ws.onmessage = (event) => {
      const newRequest = JSON.parse(event.data);
      if (newRequest.status === 'pending') {
        setRequests(prev => [newRequest, ...prev]);
        toast.info("New help request received!");
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    return () => ws.close();
  };

  const fetchRequests = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      // Fetch all requests for the customer
      const response = await fetch(`${API_ENDPOINTS.customer.requests}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch requests');
      }

      const requestsData = await response.json();

      // Filter active requests (pending, accepted, inProgress)
      const activeReqs = requestsData.filter((req: Request) =>
        ['pending', 'accepted', 'inProgress'].includes(req.status)
      );

      setRequests(requestsData); // Store all requests
      setActiveRequests(activeReqs); // Store only active requests
    } catch (error) {
      console.error('Error fetching requests:', error);
      toast.error('Failed to fetch requests');
    } finally {
      setLoading(false);
    }
  };

  const updateRequestStatus = async (requestId: string, status: 'accepted' | 'inProgress' | 'completed' | 'cancelled') => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_ENDPOINTS.customer.updateRequestStatus(requestId)}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status })
      });

      if (!response.ok) {
        throw new Error('Failed to update request status');
      }

      toast.success(`Request ${status === 'cancelled' ? 'cancelled' : 'updated'} successfully`);

      // Update local state
      fetchRequests();
    } catch (error) {
      console.error('Error updating request:', error);
      toast.error('Failed to update request');
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { text: string, variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
      pending: { text: 'Pending', variant: 'outline' },
      accepted: { text: 'Accepted', variant: 'secondary' },
      inProgress: { text: 'In Progress', variant: 'default' },
      completed: { text: 'Completed', variant: 'default' },
      cancelled: { text: 'Cancelled', variant: 'destructive' }
    };

    const config = statusConfig[status];
    return <Badge variant={config.variant}>{config.text}</Badge>;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-blue-900/80 to-green-900/50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-900/80 to-green-900/50">
      <Navbar />

      <main className="flex-grow pt-24 pb-10">
        <div className="container mx-auto px-4 py-8 text-white">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-white">My Requests</h1>
            <Button onClick={() => navigate('/request')} className="bg-accent hover:bg-accent/90">Request Help</Button>
          </div>

          {/* Active Requests Section */}
          {activeRequests.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-accent">Active Requests</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {activeRequests.map((request) => (
                  <Card key={request._id} className="bg-white/90 backdrop-blur-sm border-blue-200 shadow-lg">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle>{request.serviceType}</CardTitle>
                        {getStatusBadge(request.status)}
                      </div>
                      <CardDescription>
                        <div className="flex items-center mt-2">
                          <MapPin className="h-4 w-4 mr-2" />
                          {request.location.address}
                        </div>
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {request.helper && (
                          <>
                            <p><strong>Helper:</strong> {request.helper.fullName}</p>
                            <p><strong>Phone:</strong> {request.helper.phone}</p>
                          </>
                        )}
                        <p><strong>Vehicle:</strong> {request.vehicle}</p>
                        <p><strong>Description:</strong> {request.description}</p>
                        <p><strong>Price:</strong> ${request.estimatedPrice}</p>
                      </div>
                    </CardContent>
                    <CardFooter className="flex gap-2">
                      <Button
                        onClick={() => updateRequestStatus(request._id, 'cancelled')}
                        variant="destructive"
                        className="w-full bg-red-500 hover:bg-red-600"
                      >
                        Cancel Request
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Past Requests Section */}
          <div>
            <h2 className="text-2xl font-bold mb-4 text-accent">Request History</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {requests.filter(req => !['pending', 'accepted', 'inProgress'].includes(req.status)).map((request) => (
                <Card key={request._id} className="bg-white/90 backdrop-blur-sm border-blue-200 shadow-lg">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle>{request.serviceType}</CardTitle>
                      {getStatusBadge(request.status)}
                    </div>
                    <CardDescription>
                      <div className="flex items-center mt-2">
                        <MapPin className="h-4 w-4 mr-2" />
                        {request.location.address}
                      </div>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {request.helper && (
                        <p><strong>Helper:</strong> {request.helper.fullName}</p>
                      )}
                      <p><strong>Vehicle:</strong> {request.vehicle}</p>
                      <p><strong>Description:</strong> {request.description}</p>
                      <p><strong>Price:</strong> ${request.estimatedPrice}</p>
                      <p><strong>Date:</strong> {new Date(request.createdAt).toLocaleDateString()}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {requests.filter(req => !['pending', 'accepted', 'inProgress'].includes(req.status)).length === 0 && (
                <div className="col-span-full text-center py-12 bg-white/30 backdrop-blur-sm rounded-lg">
                  <p className="text-white">No request history</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;
