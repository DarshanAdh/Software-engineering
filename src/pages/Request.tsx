
import { useEffect, useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import RequestForm from '@/components/request/RequestForm';
import Map from '@/components/map/Map';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Request = () => {
  const [mapLocation, setMapLocation] = useState<{ latitude: number; longitude: number; address: string } | null>(null);
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col page-transition bg-gradient-to-b from-blue-900/80 to-green-900/50">
      <Navbar />

      <main className="flex-grow pt-32 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-3xl font-bold tracking-tight mb-2 text-white">Request Roadside Assistance</h1>
              <p className="text-white/80">Get help right where you need it, when you need it</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg border border-blue-200 p-6 mt-4">
                <RequestForm onLocationSelect={(location) => setMapLocation(location)} />
              </div>

              <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg border border-blue-200 p-6 lg:sticky lg:top-32 h-[500px] lg:h-[calc(100vh-220px)] mt-4">
                <Tabs defaultValue="map" className="h-full flex flex-col">
                  <TabsList className="mb-4 w-full bg-blue-100">
                    <TabsTrigger value="map" className="flex-1 data-[state=active]:bg-accent data-[state=active]:text-white">Map View</TabsTrigger>
                    <TabsTrigger value="pricing" className="flex-1 data-[state=active]:bg-accent data-[state=active]:text-white">Pricing</TabsTrigger>
                  </TabsList>

                  <TabsContent value="map" className="flex-1 overflow-hidden">
                    <Map
                      latitude={mapLocation?.latitude}
                      longitude={mapLocation?.longitude}
                      address={mapLocation?.address}
                    />
                  </TabsContent>

                  <TabsContent value="pricing" className="flex-1 overflow-y-auto p-2">
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-medium mb-2 text-blue-800">Our Transparent Pricing</h3>
                        <p className="text-blue-700 text-sm">
                          We believe in fair and transparent pricing. The price you see is the price you pay.
                        </p>
                      </div>

                      <div className="space-y-4">
                        <div className="p-4 border border-blue-200 rounded-lg bg-blue-50/50">
                          <div className="flex justify-between mb-1">
                            <span className="font-medium text-blue-800">Flat Tire Change</span>
                            <span className="font-medium text-accent">$30</span>
                          </div>
                          <p className="text-sm text-blue-700">
                            Replace your flat tire with your spare tire
                          </p>
                        </div>

                        <div className="p-4 border border-blue-200 rounded-lg bg-blue-50/50">
                          <div className="flex justify-between mb-1">
                            <span className="font-medium text-blue-800">Battery Jump-Start</span>
                            <span className="font-medium text-accent">$25</span>
                          </div>
                          <p className="text-sm text-blue-700">
                            Jump-start your vehicle's dead battery
                          </p>
                        </div>

                        <div className="p-4 border border-blue-200 rounded-lg bg-blue-50/50">
                          <div className="flex justify-between mb-1">
                            <span className="font-medium text-blue-800">Lockout Assistance</span>
                            <span className="font-medium text-accent">$35</span>
                          </div>
                          <p className="text-sm text-blue-700">
                            Help when you're locked out of your vehicle
                          </p>
                        </div>

                        <div className="p-4 border border-blue-200 rounded-lg bg-blue-50/50">
                          <div className="flex justify-between mb-1">
                            <span className="font-medium text-blue-800">Fuel Delivery</span>
                            <span className="font-medium text-accent">$40</span>
                          </div>
                          <p className="text-sm text-blue-700">
                            Emergency fuel delivery when you run out (fuel cost not included)
                          </p>
                        </div>

                        <div className="p-4 border border-blue-200 rounded-lg bg-blue-50/50">
                          <div className="flex justify-between mb-1">
                            <span className="font-medium text-blue-800">Minor Mechanical Help</span>
                            <span className="font-medium text-accent">$45</span>
                          </div>
                          <p className="text-sm text-blue-700">
                            Basic troubleshooting and minor repairs
                          </p>
                        </div>
                      </div>

                      <div className="text-sm text-blue-700">
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
