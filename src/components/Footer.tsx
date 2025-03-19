
import { useLocation } from 'react-router-dom';
import { scrollToSection } from '@/utils/animations';
import { Heart } from 'lucide-react';

const Footer = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    if (isHomePage) {
      e.preventDefault();
      scrollToSection(id);
    }
  };
  
  const year = new Date().getFullYear();
  
  return (
    <footer className="bg-primary py-12 text-primary-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
          {/* Logo and tagline */}
          <div className="text-center md:text-left">
            <div className="text-xl font-bold flex items-center justify-center md:justify-start">
              <span className="mr-1 font-mono">&lt;</span>
              <span>Taleex</span>
              <span className="ml-1 font-mono">/&gt;</span>
            </div>
            <p className="mt-2 text-sm text-primary-foreground/80 max-w-md">
              Creating elegant, functional digital experiences where design meets purpose and technology enables vision.
            </p>
          </div>
          
          {/* Quick links */}
          <div className="text-center md:text-right">
            <h3 className="text-lg font-medium mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a 
                  href={isHomePage ? '#home' : '/'} 
                  onClick={(e) => handleNavClick(e, 'home')}
                  className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                >
                  Home
                </a>
              </li>
              <li>
                <a 
                  href={isHomePage ? '#portfolio' : '/#portfolio'} 
                  onClick={(e) => handleNavClick(e, 'portfolio')}
                  className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                >
                  Portfolio
                </a>
              </li>
              <li>
                <a 
                  href={isHomePage ? '#career' : '/#career'} 
                  onClick={(e) => handleNavClick(e, 'career')}
                  className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                >
                  Career
                </a>
              </li>
              <li>
                <a 
                  href={isHomePage ? '#contact' : '/#contact'} 
                  onClick={(e) => handleNavClick(e, 'contact')}
                  className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-6 border-t border-primary-foreground/20 flex flex-col md:flex-row justify-between items-center text-sm text-primary-foreground/70">
          <p>© {year} Portfolio. All rights reserved.</p>
          <p className="mt-2 md:mt-0 flex items-center">
            Crafted with <Heart className="h-4 w-4 mx-1 text-destructive animate-pulse" /> and precision
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
