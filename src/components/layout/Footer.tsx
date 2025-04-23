

import { Link } from 'react-router-dom';
import { Twitter, Facebook, Instagram, Github, Linkedin } from 'lucide-react';

interface FooterProps {
  className?: string;
}

const Footer = ({ className = '' }: FooterProps) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={`bg-blue-900/80 backdrop-blur-sm border-t border-blue-800 py-6 text-white ${className}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-accent">Roadside Relief</h3>
            <p className="text-white/80 text-xs max-w-xs">
              Connecting stranded drivers with nearby helpers for quick roadside assistance.
            </p>
            <div className="flex space-x-2">
              <a href="#" className="text-white/80 hover:text-accent transition-colors">
                <Twitter size={14} />
              </a>
              <a href="#" className="text-white/80 hover:text-accent transition-colors">
                <Facebook size={14} />
              </a>
              <a href="#" className="text-white/80 hover:text-accent transition-colors">
                <Instagram size={14} />
              </a>
              <a href="#" className="text-white/80 hover:text-accent transition-colors">
                <Linkedin size={14} />
              </a>
              <a href="#" className="text-white/80 hover:text-accent transition-colors">
                <Github size={14} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-2 text-accent">Services</h3>
            <ul className="space-y-1 text-xs">
              <li>
                <Link to="/request" className="text-white/80 hover:text-accent transition-colors">
                  Flat Tire Assistance
                </Link>
              </li>
              <li>
                <Link to="/request" className="text-white/80 hover:text-accent transition-colors">
                  Battery Jump-Start
                </Link>
              </li>
              <li>
                <Link to="/request" className="text-white/80 hover:text-accent transition-colors">
                  Fuel Delivery
                </Link>
              </li>
              <li>
                <Link to="/request" className="text-white/80 hover:text-accent transition-colors">
                  Lockout Assistance
                </Link>
              </li>
              <li>
                <Link to="/request" className="text-white/80 hover:text-accent transition-colors">
                  Minor Mechanical Help
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-2 text-accent">Company</h3>
            <ul className="space-y-1 text-xs">
              <li>
                <Link to="/profile" className="text-white/80 hover:text-accent transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/helper" className="text-white/80 hover:text-accent transition-colors">
                  Become a Helper
                </Link>
              </li>
              <li>
                <Link to="#" className="text-white/80 hover:text-accent transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <Link to="#" className="text-white/80 hover:text-accent transition-colors">
                  Press
                </Link>
              </li>
              <li>
                <Link to="#" className="text-white/80 hover:text-accent transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-2 text-accent">Legal</h3>
            <ul className="space-y-1 text-xs">
              <li>
                <Link to="#" className="text-white/80 hover:text-accent transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="#" className="text-white/80 hover:text-accent transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="#" className="text-white/80 hover:text-accent transition-colors">
                  Cookies
                </Link>
              </li>
              <li>
                <Link to="#" className="text-white/80 hover:text-accent transition-colors">
                  Licenses
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-blue-800 text-center">
          <p className="text-xs text-white/70">
            © {currentYear} Roadside Relief. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
