
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Car, Wrench, User, Shield } from 'lucide-react';
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
      backgroundImage: 'url(/tire.jpg)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
    }}>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center px-3 py-1 rounded-full border border-blue-300 bg-blue-900/80 text-sm text-blue-300 mb-6 animate-slide-up opacity-0" style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}>
            <Shield className="mr-2 h-4 w-4 text-green-400" />
            Trusted roadside assistance
          </div>

          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3 animate-slide-up opacity-0 text-blue-300 text-shadow-lg" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
            <span className="block">Stranded? Get back on the road with</span>
            <span className="text-green-400">Roadside Assistance</span>
          </h1>

          <p className="text-lg text-blue-300 max-w-2xl mb-4 animate-slide-up opacity-0 text-shadow-md" style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}>
            Connect with nearby helpers for quick roadside assistance. From jump-starts to flat tires, get help in minutes, not hours.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-2 animate-slide-up opacity-0" style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}>
            <Button
              asChild
              size="default"
              className="w-full sm:w-auto btn-hover shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90"
            >
              <Link to={handleRequestHelp()}>
                <Car className="mr-2 h-4 w-4" />
                {isAuthenticated && user?.userType === 'helper'
                  ? 'Go to Dashboard'
                  : 'Request Help Now'}
              </Link>
            </Button>

            {!isAuthenticated && (
              <Button asChild variant="secondary" size="default" className="w-full sm:w-auto btn-hover bg-secondary hover:bg-secondary/90">
                <Link to="/register">
                  <Wrench className="mr-2 h-4 w-4" />
                  Become a Helper
                </Link>
              </Button>
            )}

            {!isAuthenticated && (
              <Button
                asChild
                variant="outline"
                size="default"
                className="w-full sm:w-auto bg-blue-900/80 text-blue-300 hover:bg-blue-800 border-blue-300"
              >
                <Link to="/login">
                  <User className="mr-2 h-4 w-4" />
                  Sign In
                </Link>
              </Button>
            )}
          </div>
        </div>


      </div>
    </div>
  );
};

export default Hero;
