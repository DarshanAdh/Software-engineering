
import React, { useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import RequestForm from '@/components/request/RequestForm';
import Map from '@/components/map/Map';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Request = () => {
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col page-transition">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold tracking-tight mb-2">Request Roadside Assistance</h1>
              <p className="text-muted-foreground">Get help right where you need it, when you need it</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="glass-card p-6">
                <RequestForm />
              </div>
              
              <div className="glass-card p-6 lg:sticky lg:top-24 h-[500px] lg:h-[calc(100vh-200px)]">
                <Tabs defaultValue="map" className="h-full flex flex-col">
                  <TabsList className="mb-4 w-full">
                    <TabsTrigger value="map" className="flex-1">Map View</TabsTrigger>
                    <TabsTrigger value="pricing" className="flex-1">Pricing</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="map" className="flex-1 overflow-hidden">
                    <Map />
                  </TabsContent>
                  
                  <TabsContent value="pricing" className="flex-1 overflow-y-auto p-2">
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-medium mb-2">Our Transparent Pricing</h3>
                        <p className="text-muted-foreground text-sm">
                          We believe in fair and transparent pricing. The price you see is the price you pay.
                        </p>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="p-4 border border-border rounded-lg">
                          <div className="flex justify-between mb-1">
                            <span className="font-medium">Flat Tire Change</span>
                            <span className="font-medium">$30</span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Replace your flat tire with your spare tire
                          </p>
                        </div>
                        
                        <div className="p-4 border border-border rounded-lg">
                          <div className="flex justify-between mb-1">
                            <span className="font-medium">Battery Jump-Start</span>
                            <span className="font-medium">$25</span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Jump-start your vehicle's dead battery
                          </p>
                        </div>
                        
                        <div className="p-4 border border-border rounded-lg">
                          <div className="flex justify-between mb-1">
                            <span className="font-medium">Lockout Assistance</span>
                            <span className="font-medium">$35</span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Help when you're locked out of your vehicle
                          </p>
                        </div>
                        
                        <div className="p-4 border border-border rounded-lg">
                          <div className="flex justify-between mb-1">
                            <span className="font-medium">Fuel Delivery</span>
                            <span className="font-medium">$40</span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Emergency fuel delivery when you run out (fuel cost not included)
                          </p>
                        </div>
                        
                        <div className="p-4 border border-border rounded-lg">
                          <div className="flex justify-between mb-1">
                            <span className="font-medium">Minor Mechanical Help</span>
                            <span className="font-medium">$45</span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Basic troubleshooting and minor repairs
                          </p>
                        </div>
                      </div>
                      
                      <div className="text-sm text-muted-foreground">
                        <p>* Additional fees may apply for services between 10pm and 6am.</p>
                        <p>* Prices may vary based on location and complexity of the service required.</p>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Request;
