import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import HowItWorksComponent from '@/components/home/HowItWorks';
import Features from '@/components/home/Features';
import Testimonials from '@/components/home/Testimonials';
import { Button } from '@/components/ui/button';
import { Car, Shield, Clock, Star, User } from 'lucide-react';

const HowItWorksPage = () => {
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);

    // Update document title
    document.title = "How It Works | Roadside Assistance";
  }, []);

  return (
    <div className="min-h-screen flex flex-col" style={{
      backgroundImage: 'url(/1.webp)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      backgroundAttachment: 'fixed'
    }}>
      <Navbar />

      <main className="flex-grow pt-16">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-24 pb-16 md:pt-32 md:pb-20 min-h-screen">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="flex flex-col items-center text-center max-w-3xl mx-auto backdrop-blur-sm bg-blue-900/30 p-8 rounded-lg border border-blue-300/20">
              <div className="inline-flex items-center px-3 py-1 rounded-full border border-blue-300 bg-blue-900/80 text-sm text-blue-300 mb-6 animate-slide-up opacity-0" style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}>
                <Shield className="mr-2 h-4 w-4 text-green-400" />
                Roadside Assistance Guide
              </div>

              <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3 animate-slide-up opacity-0 text-blue-300 text-shadow-lg" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
                <span className="block">How Roadside Assistance Works</span>
                <span className="text-green-400">Simple & Reliable Process</span>
              </h1>

              <p className="text-lg text-blue-300 max-w-2xl mb-4 animate-slide-up opacity-0 text-shadow-md" style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}>
                Get back on the road quickly with our streamlined roadside assistance process. From request to resolution in minutes.
              </p>
            </div>
          </div>
        </section>

        {/* How It Works Component */}
        <div className="backdrop-blur-sm bg-blue-900/30 p-8 rounded-lg border border-blue-300/20 my-8 mx-4">
          <HowItWorksComponent />
        </div>

        {/* Features Section */}
        <div className="backdrop-blur-sm bg-blue-900/30 p-8 rounded-lg border border-blue-300/20 my-8 mx-4">
          <Features />
        </div>

        {/* Compact Features Section */}
        <section className="relative overflow-hidden pt-24 pb-16 md:pt-32 md:pb-20 min-h-screen">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-12 backdrop-blur-sm bg-blue-900/30 p-8 rounded-lg border border-blue-300/20">
              <div className="inline-flex items-center px-3 py-1 rounded-full border border-blue-300 bg-blue-900/80 text-sm text-blue-300 mb-6">
                <Shield className="mr-2 h-4 w-4 text-green-400" />
                Why Choose Us
              </div>
              <h2 className="text-3xl font-bold mb-4 text-blue-300 text-shadow-lg">Why Choose Roadside Assistance?</h2>
              <p className="text-blue-300 text-shadow-md">
                We're revolutionizing roadside assistance with speed, reliability, and transparency.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              <div className="backdrop-blur-sm border border-blue-300/30 p-6 rounded-lg">
                <div className="w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <Car className="w-6 h-6 text-green-400" />
                </div>
                <h3 className="text-xl font-medium mb-3 text-blue-300 text-shadow-sm">Instant Assistance</h3>
                <p className="text-blue-300 text-shadow-sm">Request immediate help for flat tires, jump-starts, and more. Our platform connects you with nearby helpers in seconds.</p>
              </div>

              <div className="backdrop-blur-sm border border-blue-300/30 p-6 rounded-lg">
                <div className="w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-green-400" />
                </div>
                <h3 className="text-xl font-medium mb-3 text-blue-300 text-shadow-sm">Vetted Helpers</h3>
                <p className="text-blue-300 text-shadow-sm">All helpers undergo thorough background checks and skill verification to ensure your safety and quality service.</p>
              </div>

              <div className="backdrop-blur-sm border border-blue-300/30 p-6 rounded-lg">
                <div className="w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <Clock className="w-6 h-6 text-green-400" />
                </div>
                <h3 className="text-xl font-medium mb-3 text-blue-300 text-shadow-sm">Quick Response</h3>
                <p className="text-blue-300 text-shadow-sm">Our network ensures assistance arrives in minutes, not hours. We prioritize your time and get you back on the road quickly.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <div className="backdrop-blur-sm bg-blue-900/30 p-8 rounded-lg border border-blue-300/20 my-8 mx-4">
          <Testimonials />
        </div>

        {/* Additional Testimonials Section */}
        <section className="relative overflow-hidden pt-24 pb-16 md:pt-32 md:pb-20 min-h-screen">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-12 backdrop-blur-sm bg-blue-900/30 p-8 rounded-lg border border-blue-300/20">
              <div className="inline-flex items-center px-3 py-1 rounded-full border border-blue-300 bg-blue-900/80 text-sm text-blue-300 mb-6">
                <Shield className="mr-2 h-4 w-4 text-green-400" />
                Testimonials
              </div>
              <h2 className="text-3xl font-bold mb-4 text-blue-300 text-shadow-lg">What Our Users Say</h2>
              <p className="text-blue-300 text-shadow-md">
                Real experiences from drivers and helpers in our community
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div className="backdrop-blur-sm border border-blue-300/30 p-6 rounded-lg">
                <div className="flex mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-blue-300 italic mb-6 text-lg leading-relaxed text-shadow-sm">"I had a flat tire on the highway and was panicking. Within 15 minutes of using Roadside Assistance, a helper arrived and changed my tire."</p>
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full border border-blue-300/50 flex items-center justify-center text-blue-300 font-bold">SJ</div>
                  <div className="ml-3">
                    <div className="font-medium text-blue-300 text-shadow-sm">Sarah Johnson</div>
                    <div className="text-blue-300/80 text-sm text-shadow-sm">Stranded Driver</div>
                  </div>
                </div>
              </div>

              <div className="backdrop-blur-sm border border-blue-300/30 p-6 rounded-lg">
                <div className="flex mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-blue-300 italic mb-6 text-lg leading-relaxed text-shadow-sm">"My battery died in a shopping center parking lot. Used the app and someone came with a jump starter within 20 minutes. Transparent pricing!"</p>
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full border border-blue-300/50 flex items-center justify-center text-blue-300 font-bold">MC</div>
                  <div className="ml-3">
                    <div className="font-medium text-blue-300 text-shadow-sm">Michael Chen</div>
                    <div className="text-blue-300/80 text-sm text-shadow-sm">Regular User</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative overflow-hidden pt-24 pb-16 md:pt-32 md:pb-20 min-h-screen">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="flex flex-col items-center text-center max-w-3xl mx-auto backdrop-blur-sm bg-blue-900/30 p-8 rounded-lg border border-blue-300/20">
              <div className="inline-flex items-center px-3 py-1 rounded-full border border-blue-300 bg-blue-900/80 text-sm text-blue-300 mb-6 animate-slide-up opacity-0" style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}>
                <Shield className="mr-2 h-4 w-4 text-green-400" />
                Get Started Today
              </div>

              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-3 animate-slide-up opacity-0 text-blue-300 text-shadow-lg" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
                <span className="block">Ready to get back on the road?</span>
                <span className="text-green-400">We're here to help</span>
              </h2>

              <p className="text-lg text-blue-300 max-w-2xl mb-6 animate-slide-up opacity-0 text-shadow-md" style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}>
                Join thousands of drivers who trust Roadside Assistance for fast, reliable roadside assistance.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-4 animate-slide-up opacity-0" style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}>
                <Button
                  asChild
                  size="lg"
                  className="w-full sm:w-auto btn-hover shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90"
                >
                  <Link to="/request">
                    <Car className="mr-2 h-4 w-4" />
                    Request Help Now
                  </Link>
                </Button>

                <Button asChild variant="outline" size="lg" className="w-full sm:w-auto btn-hover border-blue-300 text-blue-300">
                  <Link to="/register">
                    <User className="mr-2 h-4 w-4" />
                    Create an Account
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default HowItWorksPage;
