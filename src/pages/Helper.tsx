
import React, { useEffect, useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import HelperCard from '@/components/helper/HelperCard';
import Map from '@/components/map/Map';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Clock, MapPin, Star, Bell, Settings, Award, CreditCard, FileText, ChevronRight } from 'lucide-react';

const Helper = () => {
  const [isOnline, setIsOnline] = useState(false);
  const [tabValue, setTabValue] = useState("available");

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  // Sample data for requests
  const availableRequests = [
    {
      id: '1',
      service: 'Flat Tire Change',
      location: 'Main St & Broadway',
      distance: '1.2 miles',
      time: '5 min',
      price: 30,
      status: 'available' as const
    },
    {
      id: '2',
      service: 'Battery Jump-Start',
      location: 'Central Park West',
      distance: '0.8 miles',
      time: '3 min',
      price: 25,
      status: 'available' as const
    },
    {
      id: '3',
      service: 'Lockout Assistance',
      location: 'Downtown Mall',
      distance: '2.5 miles',
      time: '10 min',
      price: 35,
      status: 'available' as const
    }
  ];

  const acceptedRequests = [
    {
      id: '4',
      service: 'Fuel Delivery',
      location: 'Highway 101, Mile 23',
      distance: '1.5 miles',
      time: '6 min',
      price: 40,
      status: 'accepted' as const
    }
  ];

  const completedRequests = [
    {
      id: '5',
      service: 'Minor Mechanical Help',
      location: 'Sunset Blvd',
      distance: '0.5 miles',
      time: '2 min',
      price: 45,
      status: 'completed' as const
    },
    {
      id: '6',
      service: 'Battery Jump-Start',
      location: 'Ocean Ave',
      distance: '1.8 miles',
      time: '8 min',
      price: 25,
      status: 'completed' as const
    }
  ];

  return (
    <div className="min-h-screen flex flex-col page-transition">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
              <div>
                <h1 className="text-3xl font-bold tracking-tight mb-1">Helper Dashboard</h1>
                <p className="text-muted-foreground">Manage your roadside assistance requests</p>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="online-mode" 
                    checked={isOnline}
                    onCheckedChange={setIsOnline}
                  />
                  <Label htmlFor="online-mode">
                    {isOnline ? (
                      <span className="flex items-center text-green-600">
                        <span className="inline-block w-2 h-2 rounded-full bg-green-600 mr-2 animate-pulse"></span>
                        Online
                      </span>
                    ) : (
                      <span className="text-muted-foreground">Offline</span>
                    )}
                  </Label>
                </div>
                <Button size="sm" variant="outline">
                  <Bell size={16} className="mr-2" />
                  Notifications
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="glass-card p-6">
                  <Tabs defaultValue={tabValue} onValueChange={setTabValue} className="w-full">
                    <TabsList className="w-full mb-6">
                      <TabsTrigger value="available" className="flex-1">
                        Available
                        <Badge variant="outline" className="ml-2">{availableRequests.length}</Badge>
                      </TabsTrigger>
                      <TabsTrigger value="accepted" className="flex-1">
                        In Progress
                        <Badge variant="outline" className="ml-2">{acceptedRequests.length}</Badge>
                      </TabsTrigger>
                      <TabsTrigger value="completed" className="flex-1">
                        Completed
                        <Badge variant="outline" className="ml-2">{completedRequests.length}</Badge>
                      </TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="available" className="space-y-4">
                      {isOnline ? (
                        availableRequests.length > 0 ? (
                          availableRequests.map(request => (
                            <HelperCard key={request.id} request={request} />
                          ))
                        ) : (
                          <div className="text-center py-12">
                            <p className="text-muted-foreground">No available requests at the moment.</p>
                            <p className="text-sm">Check back later for new requests.</p>
                          </div>
                        )
                      ) : (
                        <div className="text-center py-12">
                          <p className="text-muted-foreground">You're currently offline.</p>
                          <p className="text-sm">Go online to see and accept requests.</p>
                        </div>
                      )}
                    </TabsContent>
                    
                    <TabsContent value="accepted" className="space-y-4">
                      {acceptedRequests.length > 0 ? (
                        acceptedRequests.map(request => (
                          <HelperCard key={request.id} request={request} />
                        ))
                      ) : (
                        <div className="text-center py-12">
                          <p className="text-muted-foreground">No active requests.</p>
                          <p className="text-sm">Accept a request to get started.</p>
                        </div>
                      )}
                    </TabsContent>
                    
                    <TabsContent value="completed" className="space-y-4">
                      {completedRequests.length > 0 ? (
                        completedRequests.map(request => (
                          <HelperCard key={request.id} request={request} />
                        ))
                      ) : (
                        <div className="text-center py-12">
                          <p className="text-muted-foreground">No completed requests yet.</p>
                        </div>
                      )}
                    </TabsContent>
                  </Tabs>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="glass-card p-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white">
                      JD
                    </div>
                    <div>
                      <h3 className="font-medium">John Doe</h3>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Star size={14} className="text-yellow-400 fill-yellow-400 mr-1" />
                        <span>4.9 (124 reviews)</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2 mb-4">
                    <Badge variant="outline" className="flex items-center">
                      <Award size={12} className="mr-1" />
                      Certified
                    </Badge>
                    <Badge variant="outline" className="flex items-center">
                      <Clock size={12} className="mr-1" />
                      2 years
                    </Badge>
                  </div>
                  
                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Today's Earnings</span>
                      <span>$85.00</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Weekly Earnings</span>
                      <span>$435.00</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">This Month</span>
                      <span>$1,245.00</span>
                    </div>
                  </div>
                  
                  <Button variant="outline" className="w-full text-sm justify-between">
                    <span className="flex items-center">
                      <CreditCard size={14} className="mr-2" />
                      View Earnings Details
                    </span>
                    <ChevronRight size={14} />
                  </Button>
                </div>
                
                <div className="glass-card p-6 h-[300px]">
                  <h3 className="font-medium mb-4">Your Service Area</h3>
                  <div className="h-[240px]">
                    <Map />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Button variant="outline" className="w-full text-sm justify-between">
                    <span className="flex items-center">
                      <Settings size={14} className="mr-2" />
                      Account Settings
                    </span>
                    <ChevronRight size={14} />
                  </Button>
                  
                  <Button variant="outline" className="w-full text-sm justify-between">
                    <span className="flex items-center">
                      <FileText size={14} className="mr-2" />
                      Help Center
                    </span>
                    <ChevronRight size={14} />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Helper;
