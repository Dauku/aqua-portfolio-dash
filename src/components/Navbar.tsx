
import { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { scrollToSection } from '@/utils/animations';
import { useAuthStore } from '@/utils/auth';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated } = useAuthStore();
  
  const isHomePage = location.pathname === '/';
  
  // Check if we're on the homepage to determine if we should use smooth scroll
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    if (isHomePage) {
      e.preventDefault();
      setIsMenuOpen(false);
      scrollToSection(id);
    }
  };
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Navigation links
  const navLinks = [
    { name: 'Home', id: 'home', path: '/' },
    { name: 'Portfolio', id: 'portfolio', path: '/#portfolio' },
    { name: 'Career', id: 'career', path: '/#career' },
    { name: 'Contact', id: 'contact', path: '/#contact' },
  ];
  
  return (
    <header 
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'py-3 bg-background/80 backdrop-blur-md shadow-sm' : 'py-6 bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link 
            to="/" 
            className="text-xl font-bold flex items-center"
            onClick={(e) => isHomePage && handleNavClick(e, 'home')}
          >
            <span className="text-primary mr-1 font-mono">&lt;</span>
            <span>Taleex</span>
            <span className="text-primary ml-1 font-mono">/&gt;</span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.id}
                to={link.path}
                className="navigation-link"
                onClick={(e) => handleNavClick(e, link.id)}
              >
                {link.name}
              </Link>
            ))}
            
            {isAuthenticated && (
              <Link
                to="/backoffice"
                className="ml-4 px-4 py-2 bg-primary text-primary-foreground rounded-md transition-colors hover:bg-primary/90"
              >
                Admin
              </Link>
            )}
            
            {!isAuthenticated && (
              <Link
                to="/login"
                className="ml-4 px-4 py-2 border border-primary text-primary rounded-md transition-colors hover:bg-primary/10"
              >
                Login
              </Link>
            )}
          </nav>
          
          {/* Mobile Menu Button */}
          <button
            type="button"
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      <div className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'}`}>
        <div className="px-4 pt-2 pb-4 space-y-1 sm:px-6 bg-background/95 backdrop-blur-md">
          {navLinks.map((link) => (
            <Link
              key={link.id}
              to={link.path}
              className="block px-3 py-2 text-base font-medium hover:text-primary"
              onClick={(e) => handleNavClick(e, link.id)}
            >
              {link.name}
            </Link>
          ))}
          
          {isAuthenticated ? (
            <Link
              to="/backoffice"
              className="block px-3 py-2 mt-4 text-center bg-primary text-primary-foreground rounded-md"
            >
              Admin
            </Link>
          ) : (
            <Link
              to="/login"
              className="block px-3 py-2 mt-4 text-center border border-primary text-primary rounded-md"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
