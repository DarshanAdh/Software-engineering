import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { MapPin, Clock, PhoneCall, MessageSquare, Car, DollarSign, Star } from 'lucide-react';
import { API_ENDPOINTS } from '@/config/api';
import PastEarnings from '../components/helper/PastEarnings';

const HelperDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [availableRequests, setAvailableRequests] = useState<any[]>([]);
  const [activeRequests, setActiveRequests] = useState<any[]>([]);
  const [pastRequests, setPastRequests] = useState<any[]>([]);
  const [isAvailable, setIsAvailable] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  // Earnings state removed as it's no longer needed

  useEffect(() => {
    // Check if user is logged in as helper
    const token = localStorage.getItem('token');
    const userType = localStorage.getItem('userType');

    if (!token) {
      navigate('/login');
      return;
    }

    // Redirect to customer dashboard if user is not a helper
    if (userType !== 'helper') {
      navigate('/dashboard');
      return;
    }

    const fetchData = async () => {
      try {
        setIsLoading(true);
        // Fetch helper profile
        const profileResponse = await fetch(`${API_ENDPOINTS.helper.profile}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!profileResponse.ok) {
          throw new Error('Failed to fetch helper profile');
        }

        const profileData = await profileResponse.json();
        setUser(profileData);
        setIsAvailable(profileData.isAvailable);

        // Only fetch available requests if helper is available
        if (profileData.isAvailable) {
          const availableResponse = await fetch(`${API_ENDPOINTS.helper.availableRequests}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (availableResponse.ok) {
            const availableData = await availableResponse.json();
            setAvailableRequests(availableData);
          }
        } else {
          setAvailableRequests([]);
        }

        // Fetch active and past requests
        const historyResponse = await fetch(`${API_ENDPOINTS.helper.myRequests}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (historyResponse.ok) {
          const historyData = await historyResponse.json();

          setActiveRequests(historyData.filter((req: any) => ['accepted', 'inProgress'].includes(req.status)));
          setPastRequests(historyData.filter((req: any) => ['completed', 'cancelled'].includes(req.status)));
        }

        // Earnings fetch code removed as it's no longer needed
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error("Failed to load dashboard data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    // Set up polling for new requests (every 30 seconds)
    const intervalId = setInterval(() => {
      if (isAvailable) {
        fetchData();
      }
    }, 30000);

    return () => clearInterval(intervalId);
  }, [navigate, isAvailable]);

  const toggleAvailability = async () => {
    const token = localStorage.getItem('token');

    try {
      const response = await fetch(`${API_ENDPOINTS.helper.availability}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include',
        body: JSON.stringify({ isAvailable: !isAvailable })
      });

      if (!response.ok) {
        throw new Error('Failed to update availability');
      }

      setIsAvailable(!isAvailable);

      toast.success(`You are now ${!isAvailable ? 'available' : 'unavailable'} for new requests.`);
    } catch (error) {
      console.error('Error updating availability:', error);
      toast.error("Failed to update your availability status.");
    }
  };

  const acceptRequest = async (requestId: string) => {
    const token = localStorage.getItem('token');

    try {
      const response = await fetch(`${API_ENDPOINTS.helper.acceptRequest(requestId)}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to accept request');
      }

      // Refresh the data
      const requestResponse = await fetch(`${API_ENDPOINTS.customer.getRequest(requestId)}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!requestResponse.ok) {
        throw new Error('Failed to fetch updated request');
      }

      const requestData = await requestResponse.json();

      // Move request from available to active
      setAvailableRequests(prev => prev.filter(req => req._id !== requestId));
      setActiveRequests(prev => [...prev, requestData]);

      toast.success("Request accepted! You have successfully accepted the request.");
    } catch (error) {
      console.error('Error accepting request:', error);
      toast.error("Failed to accept the request. It may have been taken by another helper.");
    }
  };

  const updateRequestStatus = async (requestId: string, status: 'accepted' | 'inProgress' | 'completed' | 'cancelled') => {
    const token = localStorage.getItem('token');

    try {
      const response = await fetch(`${API_ENDPOINTS.helper.updateRequestStatus(requestId)}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });

      if (!response.ok) {
        throw new Error('Failed to update request status');
      }

      const updatedRequest = await response.json();

      // Update lists
      if (status === 'inProgress') {
        setActiveRequests(prev =>
          prev.map(req => req._id === requestId ? updatedRequest : req)
        );
        toast.success("Job started! The customer has been notified.");
      } else if (status === 'completed') {
        setActiveRequests(prev => prev.filter(req => req._id !== requestId));
        setPastRequests(prev => [updatedRequest, ...prev]);
        toast.success("Job completed! Thank you for your service.");
      } else if (status === 'cancelled') {
        setActiveRequests(prev => prev.filter(req => req._id !== requestId));
        setPastRequests(prev => [updatedRequest, ...prev]);
        toast.info("Job cancelled. The customer has been notified.");
      }
    } catch (error) {
      console.error('Error updating request status:', error);
      toast.error("Failed to update the request status.");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-900/80 to-green-900/50">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto"></div>
            <p className="mt-4 text-white">Loading your dashboard...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-900/80 to-green-900/50">
      <Navbar />

      <main className="flex-grow pt-24 pb-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2 text-white">Helper Dashboard</h1>
              <p className="text-white/80">Welcome back, {user?.fullName || 'Helper'}</p>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="available-mode"
                  checked={isAvailable}
                  onCheckedChange={toggleAvailability}
                />
                <Label htmlFor="available-mode">
                  {isAvailable ? (
                    <span className="flex items-center text-accent">
                      <span className="relative flex h-3 w-3 mr-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent/60 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-accent"></span>
                      </span>
                      Available
                    </span>
                  ) : (
                    <span className="text-white/70">Unavailable</span>
                  )}
                </Label>
              </div>

              {/* Removed the Profile button */}
            </div>
          </div>

          <Tabs defaultValue="available" className="w-full">
            <TabsList className="mb-4 w-full max-w-md mx-auto grid grid-cols-4 bg-blue-100">
              <TabsTrigger value="available" className="data-[state=active]:bg-accent data-[state=active]:text-white">
                Available
                {availableRequests.length > 0 && (
                  <Badge variant="secondary" className="ml-2">{availableRequests.length}</Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="active" className="data-[state=active]:bg-accent data-[state=active]:text-white">
                Active
                {activeRequests.length > 0 && (
                  <Badge variant="secondary" className="ml-2">{activeRequests.length}</Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="history" className="data-[state=active]:bg-accent data-[state=active]:text-white">History</TabsTrigger>
              <TabsTrigger value="past-earnings" className="data-[state=active]:bg-accent data-[state=active]:text-white">Past Earnings</TabsTrigger>
            </TabsList>

            <TabsContent value="available">
              <div className="space-y-4">
                {!isAvailable ? (
                  <Card className="bg-white/90 backdrop-blur-sm border-blue-200 shadow-lg">
                    <CardContent className="pt-6 text-center">
                      <p className="text-blue-700">You are currently set to unavailable. Toggle your status to see available requests.</p>
                    </CardContent>
                  </Card>
                ) : availableRequests.length === 0 ? (
                  <Card className="bg-white/90 backdrop-blur-sm border-blue-200 shadow-lg">
                    <CardContent className="pt-6 text-center">
                      <p className="text-blue-700">No available requests at the moment</p>
                    </CardContent>
                  </Card>
                ) : (
                  availableRequests.map((request) => (
                    <Card key={request._id} className="bg-white/90 backdrop-blur-sm border-blue-200 shadow-lg">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <CardTitle className="flex items-center gap-2">
                            <Car className="h-5 w-5" />
                            {request.serviceType}
                            {request.isUrgent && (
                              <Badge variant="destructive">Urgent</Badge>
                            )}
                          </CardTitle>
                          <Badge variant="outline" className="ml-2">
                            ${request.estimatedPrice}
                          </Badge>
                        </div>
                        <CardDescription className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" /> {request.location.address}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="text-sm">
                            <span className="font-medium">Issue: </span>
                            {request.description}
                          </div>

                          <div className="text-sm flex items-center gap-1">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">
                              {new Date(request.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </span>
                            <span className="text-xs bg-teal-100 text-teal-800 rounded-full px-2 py-0.5 ml-2">
                              {Math.round(request.distanceInMiles || 3)} miles away
                            </span>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="flex flex-col sm:flex-row gap-2">
                        <Button
                          className="w-full sm:w-auto bg-accent hover:bg-accent/90"
                          onClick={() => acceptRequest(request._id)}
                        >
                          Accept Request
                        </Button>

                        <Button
                          variant="outline"
                          className="w-full sm:w-auto"
                          onClick={() => window.open(`https://maps.google.com?q=${request.location.address}`)}
                        >
                          View on Map
                        </Button>
                      </CardFooter>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>

            <TabsContent value="active">
              <div className="space-y-4">
                {activeRequests.length === 0 ? (
                  <Card className="bg-white/90 backdrop-blur-sm border-blue-200 shadow-lg">
                    <CardContent className="pt-6 text-center">
                      <p className="text-blue-700">You have no active jobs</p>
                    </CardContent>
                  </Card>
                ) : (
                  activeRequests.map((request) => (
                    <Card key={request._id} className="bg-white/90 backdrop-blur-sm border-blue-200 shadow-lg">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <CardTitle>{request.serviceType}</CardTitle>
                          <Badge
                            variant={request.status === 'in_progress' ? 'default' : 'secondary'}
                          >
                            {request.status === 'accepted' ? 'Accepted' : 'In Progress'}
                          </Badge>
                        </div>
                        <CardDescription className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" /> {request.location.address}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="text-sm">
                            <span className="font-medium">Customer: </span>
                            {request.user?.fullName || 'Customer'}
                          </div>

                          <div className="text-sm">
                            <span className="font-medium">Issue: </span>
                            {request.description}
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full"
                              onClick={() => window.open(`tel:${request.user?.phone}`)}
                            >
                              <PhoneCall className="mr-2 h-4 w-4" />
                              Call
                            </Button>

                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full"
                              onClick={() => window.open(`sms:${request.user?.phone}`)}
                            >
                              <MessageSquare className="mr-2 h-4 w-4" />
                              Message
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="flex flex-col sm:flex-row gap-2">
                        {request.status === 'accepted' ? (
                          <Button
                            className="w-full sm:w-auto bg-accent hover:bg-accent/90"
                            onClick={() => updateRequestStatus(request._id, 'inProgress')}
                          >
                            Start Job
                          </Button>
                        ) : (
                          <Button
                            className="w-full sm:w-auto bg-accent hover:bg-accent/90"
                            onClick={() => updateRequestStatus(request._id, 'completed')}
                          >
                            Complete Job
                          </Button>
                        )}

                        <Button
                          variant="outline"
                          className="w-full sm:w-auto"
                          onClick={() => window.open(`https://maps.google.com?q=${request.location.address}`)}
                        >
                          Get Directions
                        </Button>
                      </CardFooter>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>

            <TabsContent value="history">
              <div className="space-y-4">
                {pastRequests.length === 0 ? (
                  <Card className="bg-white/90 backdrop-blur-sm border-blue-200 shadow-lg">
                    <CardContent className="pt-6 text-center">
                      <p className="text-blue-700">You have no completed jobs yet</p>
                    </CardContent>
                  </Card>
                ) : (
                  pastRequests.map((request) => (
                    <Card key={request._id} className="bg-white/90 backdrop-blur-sm border-blue-200 shadow-lg">
                      <CardHeader>
                        <div className="flex justify-between">
                          <CardTitle className="flex items-center gap-2">
                            {request.serviceType}
                            <Badge variant={request.status === 'completed' ? 'default' : 'destructive'}>
                              {request.status === 'completed' ? 'Completed' : 'Cancelled'}
                            </Badge>
                          </CardTitle>
                          <div className="flex items-center">
                            <DollarSign className="h-4 w-4 text-green-600 mr-1" />
                            <span className="font-medium">${request.payment?.amount?.toFixed(2) || request.estimatedPrice}</span>
                          </div>
                        </div>
                        <CardDescription className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                          <span className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1" /> {request.location.address}
                          </span>
                          <span className="flex items-center text-muted-foreground">
                            <Clock className="h-4 w-4 mr-1" /> {new Date(request.completedAt || request.cancelledAt || request.createdAt).toLocaleDateString()}
                          </span>
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        {request.status === 'completed' && request.rating && (
                          <div className="mb-3 flex items-center">
                            <span className="text-sm font-medium mr-2">Customer Rating:</span>
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < request.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                        )}

                        {request.review && (
                          <div className="text-sm border-l-4 border-teal-100 pl-3 py-1 mb-3 italic">
                            "{request.review}"
                          </div>
                        )}

                        <div className="text-sm">
                          <span className="font-medium">Customer: </span>
                          {request.user?.fullName || 'Customer'}
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={() => navigate(`/requests/${request._id}`)}
                        >
                          View Details
                        </Button>
                      </CardFooter>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>



            <TabsContent value="past-earnings">
              <PastEarnings />
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default HelperDashboard;
