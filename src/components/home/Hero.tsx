
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
    <div className="relative overflow-hidden pt-24 pb-16 md:pt-32 md:pb-20" style={{
      backgroundImage: 'url(/roadside.jpg)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
    }}>
      {/* Background Overlay - Blue-green gradient overlay */}
      <div className="absolute inset-0 overflow-hidden bg-gradient-to-br from-blue-900/60 to-green-900/60">
        {/* Using a blue-green gradient overlay to match our new color scheme while ensuring text readability */}
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center px-3 py-1 rounded-full border border-white/30 bg-blue-900/30 text-sm text-white mb-6 animate-slide-up opacity-0" style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}>
            <Shield className="mr-2 h-4 w-4 text-accent" />
            Trusted roadside assistance
          </div>

          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 animate-slide-up opacity-0 text-white" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
            <span className="block">Stranded? Get back on the road with</span>
            <span className="text-accent">Roadside Relief</span>
          </h1>

          <p className="text-xl text-white/80 max-w-2xl mb-8 animate-slide-up opacity-0" style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}>
            Connect with nearby helpers for quick roadside assistance. From jump-starts to flat tires, get help in minutes, not hours.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 animate-slide-up opacity-0" style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}>
            <Button
              asChild
              size="lg"
              className="w-full sm:w-auto btn-hover shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90"
            >
              <Link to={handleRequestHelp()}>
                <Car className="mr-2 h-5 w-5" />
                {isAuthenticated && user?.userType === 'helper'
                  ? 'Go to Dashboard'
                  : 'Request Help Now'}
              </Link>
            </Button>

            {!isAuthenticated && (
              <Button asChild variant="secondary" size="lg" className="w-full sm:w-auto btn-hover bg-secondary hover:bg-secondary/90">
                <Link to="/register">
                  <Wrench className="mr-2 h-5 w-5" />
                  Become a Helper
                </Link>
              </Button>
            )}
          </div>

          {/* Login Link - Simplified */}
          {!isAuthenticated && (
            <div className="mt-6 animate-slide-up opacity-0" style={{ animationDelay: '0.5s', animationFillMode: 'forwards' }}>
              <Button
                asChild
                variant="link"
                className="text-accent font-medium hover:text-accent/80"
              >
                <Link to="/login">
                  <User className="mr-2 h-4 w-4" />
                  Sign In
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Hero;
