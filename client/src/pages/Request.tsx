
import { useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import RequestForm from '@/components/request/RequestForm';

const Request = () => {
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col page-transition">
      <div className="absolute inset-0 z-0">
        <img
          src="/tow.jpg"
          alt="Tow truck service"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50"></div>
      </div>

      <Navbar />

      <main className="flex-grow pt-32 pb-16 relative z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-3xl font-bold tracking-tight mb-2 text-white">Request Roadside Assistance</h1>
              <p className="text-white/90">Get help right where you need it, when you need it</p>
            </div>

            <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg border border-blue-200 p-6">
              <RequestForm />
            </div>
          </div>
        </div>
      </main>

      <Footer className="relative z-10" />
    </div>
  );
};

export default Request;
