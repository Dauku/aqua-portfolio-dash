
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowDownCircle } from 'lucide-react';
import { scrollToSection } from '@/utils/animations';

// Importing framer-motion for better animations
<lov-add-dependency>framer-motion@11.0.3</lov-add-dependency>

const Hero = () => {
  const [loaded, setLoaded] = useState(false);
  
  useEffect(() => {
    setLoaded(true);
  }, []);
  
  return (
    <section id="home" className="min-h-screen flex flex-col justify-center relative overflow-hidden pt-24">
      <div className="absolute inset-0 bg-gradient-to-br from-aqua/10 to-cream/30 z-0" />
      
      {/* Decorative elements */}
      <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-aqua rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-subtle" />
      <div className="absolute bottom-1/3 left-1/4 w-96 h-96 bg-cream rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-subtle" />
      
      <div className="section-container relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={loaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="block">Design</span>
              <span className="text-aqua">Development</span>
              <span className="block">Perfection</span>
            </h1>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={loaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-2xl mx-auto">
              Creating elegant, functional digital experiences where design meets purpose and technology enables vision.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={loaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <button
              className="px-8 py-3 bg-aqua text-white rounded-md font-medium transition-all hover:bg-aqua/90 hover:shadow-lg"
              onClick={() => scrollToSection('portfolio')}
            >
              View Work
            </button>
            <button
              className="px-8 py-3 border-2 border-aqua text-aqua bg-transparent rounded-md font-medium transition-all hover:bg-aqua/10"
              onClick={() => scrollToSection('contact')}
            >
              Contact Me
            </button>
          </motion.div>
        </div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={loaded ? { opacity: 1 } : {}}
          transition={{ duration: 1, delay: 1.2 }}
          className="absolute bottom-12 left-1/2 transform -translate-x-1/2"
        >
          <button 
            className="flex items-center flex-col gap-2 text-sm font-medium opacity-70 hover:opacity-100 transition-opacity"
            onClick={() => scrollToSection('portfolio')}
          >
            <span>Scroll down</span>
            <ArrowDownCircle size={24} className="animate-bounce" />
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
