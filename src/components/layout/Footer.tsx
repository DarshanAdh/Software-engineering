

import { Link } from 'react-router-dom';
import { Twitter, Facebook, Instagram, Github, Linkedin } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-blue-900 border-t border-blue-800 py-12 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-accent">Roadside Relief</h3>
            <p className="text-white/80 text-sm max-w-xs">
              Connecting stranded drivers with nearby helpers for quick roadside assistance.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-white/80 hover:text-accent transition-colors">
                <Twitter size={18} />
              </a>
              <a href="#" className="text-white/80 hover:text-accent transition-colors">
                <Facebook size={18} />
              </a>
              <a href="#" className="text-white/80 hover:text-accent transition-colors">
                <Instagram size={18} />
              </a>
              <a href="#" className="text-white/80 hover:text-accent transition-colors">
                <Linkedin size={18} />
              </a>
              <a href="#" className="text-white/80 hover:text-accent transition-colors">
                <Github size={18} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-accent">Services</h3>
            <ul className="space-y-2 text-sm">
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
            <h3 className="text-lg font-semibold mb-4 text-accent">Company</h3>
            <ul className="space-y-2 text-sm">
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
            <h3 className="text-lg font-semibold mb-4 text-accent">Legal</h3>
            <ul className="space-y-2 text-sm">
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

        <div className="mt-12 pt-8 border-t border-blue-800 text-center">
          <p className="text-sm text-white/70">
            © {currentYear} Roadside Relief. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
