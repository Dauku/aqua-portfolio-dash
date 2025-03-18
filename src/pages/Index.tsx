
import { useEffect } from 'react';
import Hero from '@/components/Hero';
import Portfolio from '@/components/Portfolio';
import Career from '@/components/Career';
import Contact from '@/components/Contact';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const Index = () => {
  // Scroll to element if URL has hash
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const id = hash.substring(1);
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
          window.scrollTo({
            top: element.offsetTop - 80,
            behavior: 'smooth'
          });
        }, 100);
      }
    }
  }, []);
  
  return (
    <>
      <Navbar />
      <Hero />
      <Portfolio />
      <Career />
      <Contact />
      <Footer />
    </>
  );
};

export default Index;
