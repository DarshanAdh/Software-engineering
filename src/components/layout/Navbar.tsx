import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X, Car, LogOut, Shield } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const getNavItems = () => {
    // Base items for regular users
    const baseItems = [
      { name: 'Home', path: '/' },
      { name: 'How It Works', path: '/how-it-works' },
    ];

    if (isAuthenticated) {
      // Admin-specific navigation
      if (user?.userType === 'admin') {
        return [
          { name: 'Admin Dashboard', path: '/admin-dashboard' },
          { name: 'Pending Helpers', path: '/admin-dashboard?tab=pending-helpers' },
          { name: 'All Users', path: '/admin-dashboard?tab=all-users' },
          { name: 'Transactions', path: '/admin-dashboard?tab=transactions' }
        ];
      }
      // Helper-specific navigation
      else if (user?.userType === 'helper') {
        return [
          ...baseItems,
          { name: 'Dashboard', path: '/helper-dashboard' }
        ];
      }
      // Customer-specific navigation
      else {
        return [
          ...baseItems,
          { name: 'Dashboard', path: '/dashboard' },
          { name: 'Request Help', path: '/request' }
        ];
      }
    }

    return baseItems;
  };

  const navItems = getNavItems();

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-blue-900/80 backdrop-blur-md shadow-sm' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4">
          <Link to="/" className="flex items-center space-x-2">
            <img
              src="/logo.png"
              alt="Roadside Caretakers Logo"
              className="h-10 w-auto rounded-full object-cover border-2 border-green-400 shadow-md"
            />
            <span className="text-xl font-semibold tracking-tight flex items-center text-blue-300">
              Roadside Assistance
              <Shield className="ml-2 h-4 w-4 text-green-400" />
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`nav-link text-blue-300 ${
                  location.pathname === item.path ? 'text-green-400 after:scale-x-100' : ''
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <Button
                variant="ghost"
                className="text-blue-300 hover:text-green-400"
                onClick={logout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Log Out
              </Button>
            ) : (
              <Button asChild variant="ghost" className="text-blue-300 hover:text-green-400">
                <Link to="/login">Sign In</Link>
              </Button>
            )}
          </div>

          {/* Mobile Navigation Toggle */}
          <button
            className="md:hidden p-2 rounded-md text-white hover:bg-accent/80 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu - Simplified */}
      <div
        className={`md:hidden fixed inset-0 top-[69px] bg-blue-900/95 transition-transform duration-300 ease-in-out z-40 transform ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <nav className="flex flex-col p-6 space-y-6">
          <div className="flex items-center space-x-3 mb-4">
            <img
              src="/logo.png"
              alt="Roadside Caretakers Logo"
              className="h-10 w-auto rounded-full object-cover border-2 border-green-400 shadow-md"
            />
            <span className="text-xl font-semibold text-blue-300">Roadside Assistance</span>
          </div>
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className="text-lg font-medium text-blue-300 hover:text-green-400 transition-colors"
            >
              {item.name}
            </Link>
          ))}
          <hr className="border-t border-border my-4" />

          {isAuthenticated ? (
            <Button variant="outline" className="w-full text-blue-300 border-blue-300/30 hover:bg-blue-800/50" onClick={logout}>
              <LogOut className="mr-2 h-4 w-4" />
              Log Out
            </Button>
          ) : (
            <Button variant="outline" className="w-full text-blue-300 border-blue-300/30 hover:bg-blue-800/50" asChild>
              <Link to="/login">Sign In</Link>
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
