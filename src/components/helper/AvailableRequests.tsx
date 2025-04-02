import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { API_ENDPOINTS } from '@/config/api';
import { Car, MapPin, Clock, DollarSign } from "lucide-react";

interface Request {
  _id: string;
  serviceType: string;
  description: string;
  location: {
    address: string;
    coordinates: [number, number];
  };
  estimatedPrice: number;
  createdAt: string;
  distanceInMiles: number;
  user: {
    fullName: string;
  };
}

const AvailableRequests = () => {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAvailableRequests();
  }, []);

  const fetchAvailableRequests = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error("Please login to view requests");
        navigate('/login');
        return;
      }

      // Check if user is a helper
      const tokenPayload = JSON.parse(atob(token.split('.')[1]));
      if (tokenPayload.userType !== 'helper') {
        toast.error("Only helpers can view available requests");
        navigate('/dashboard');
        return;
      }

      const response = await fetch(API_ENDPOINTS.helper.availableRequests, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to fetch requests');
      }

      const data = await response.json();
      setRequests(data);
    } catch (error: any) {
      console.error('Error fetching requests:', error);
      toast.error(error.message || 'Failed to load requests');
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptRequest = async (requestId: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch(API_ENDPOINTS.helper.acceptRequest(requestId), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to accept request');
      }

      toast.success('Request accepted successfully!');
      fetchAvailableRequests(); // Refresh the list
    } catch (error: any) {
      console.error('Error accepting request:', error);
      toast.error(error.message || 'Failed to accept request');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <div className="text-center py-8">
        <h3 className="text-lg font-semibold">No available requests</h3>
        <p className="text-muted-foreground">Check back later for new requests</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {requests.map((request) => (
        <Card key={request._id}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Car className="h-5 w-5" />
              {request.serviceType}
            </CardTitle>
            <CardDescription>
              Requested by {request.user.fullName}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{request.location.address}</span>
                <span className="text-muted-foreground">({request.distanceInMiles} miles away)</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>{new Date(request.createdAt).toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">${request.estimatedPrice}</span>
              </div>
              <p className="text-sm text-muted-foreground mt-2">{request.description}</p>
            </div>
            <Button 
              className="w-full mt-4" 
              onClick={() => handleAcceptRequest(request._id)}
            >
              Accept Request
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default AvailableRequests; 