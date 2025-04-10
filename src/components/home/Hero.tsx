
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Car } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Hero = () => {
  const { isAuthenticated, user } = useAuth();

  const handleRequestHelp = () => {
    if (!isAuthenticated) {
      return '/login';
    }
    return user?.userType === 'customer' ? '/request' : '/dashboard';
  };

  return (
    <div className="relative overflow-hidden pt-16 pb-16 min-h-screen" style={{
      backgroundImage: 'url(/img.jpg)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      backgroundAttachment: 'fixed'
    }}>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col items-center text-center max-w-2xl mx-auto mt-20">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 animate-slide-up opacity-0 text-blue-300 text-shadow-lg" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
            <span className="block">Stranded? Get back on the road with</span>
            <span className="text-green-400">Roadside Assistance</span>
          </h1>

          <p className="text-xl text-blue-300 max-w-2xl mb-8 animate-slide-up opacity-0 text-shadow-md" style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}>
            Fast, reliable roadside help when you need it most. Available 24/7.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 animate-slide-up opacity-0" style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}>
            <Button
              asChild
              size="lg"
              className="w-full sm:w-auto btn-hover shadow-lg shadow-primary/20 bg-green-500 hover:bg-green-600 text-white"
            >
              <Link to={handleRequestHelp()}>
                <Car className="mr-2 h-5 w-5" />
                Need Help Now
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
