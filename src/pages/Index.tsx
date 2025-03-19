
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { HeroService, PortfolioService, CareerService, ContactService, SkillService } from '@/utils/airtable';
import { toast } from '@/components/ui/use-toast';

import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Portfolio from '@/components/Portfolio';
import Career from '@/components/Career';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import Skills from '@/components/Skills';
import { Skeleton } from '@/components/ui/skeleton';

const Index = () => {
  const { 
    data: heroData, 
    isLoading: heroLoading,
    error: heroError 
  } = useQuery({
    queryKey: ['hero'],
    queryFn: () => HeroService.get(),
    retry: 1
  });
  
  const { 
    data: portfolioData, 
    isLoading: portfolioLoading,
    error: portfolioError
  } = useQuery({
    queryKey: ['portfolio'],
    queryFn: () => PortfolioService.getAll(),
    retry: 1
  });
  
  const { 
    data: careerData, 
    isLoading: careerLoading,
    error: careerError
  } = useQuery({
    queryKey: ['career'],
    queryFn: () => CareerService.getAll(),
    retry: 1
  });
  
  const { 
    data: contactData, 
    isLoading: contactLoading,
    error: contactError
  } = useQuery({
    queryKey: ['contact'],
    queryFn: () => ContactService.get(),
    retry: 1
  });
  
  const { 
    data: skillsData, 
    isLoading: skillsLoading,
    error: skillsError
  } = useQuery({
    queryKey: ['skills'],
    queryFn: () => SkillService.getAll(),
    retry: 1
  });
  
  useEffect(() => {
    // Show error notification if any data fetching fails
    const errors = [heroError, portfolioError, careerError, contactError, skillsError].filter(Boolean);
    if (errors.length > 0) {
      toast({
        title: "Error loading data",
        description: "Some content couldn't be loaded. Please try again later.",
        variant: "destructive",
      });
    }
  }, [heroError, portfolioError, careerError, contactError, skillsError]);
  
  // Default values in case data is missing
  const defaultHero = {
    title: "Design Development Perfection",
    subtitle: "Creating elegant, functional digital experiences where design meets purpose and technology enables vision."
  };
  
  const defaultPortfolio = [];
  
  const defaultCareer = [];
  
  const defaultContact = {
    email: "hello@example.com",
    phone: "+1 (234) 567-890",
    location: "San Francisco, CA"
  };
  
  const defaultSkills = [];
  
  return (
    <div className="bg-background text-foreground">
      <Navbar />
      
      <main>
        <section id="home" className="pt-16 md:pt-20">
          {heroLoading ? (
            <div className="container px-4 py-20">
              <Skeleton className="h-16 w-3/4 mb-4" />
              <Skeleton className="h-24 w-full" />
            </div>
          ) : (
            <Hero 
              title={heroData?.title || defaultHero.title} 
              subtitle={heroData?.subtitle || defaultHero.subtitle} 
            />
          )}
        </section>
        
        <section id="portfolio" className="py-20">
          <div className="container px-4">
            <motion.h2 
              className="text-3xl md:text-4xl font-bold mb-8 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              Portfolio
            </motion.h2>
            
            {/* Fixed: Updated from items={} to match what Portfolio expects */}
            <Portfolio items={portfolioData || defaultPortfolio} />
          </div>
        </section>
        
        <section id="career" className="py-20 bg-muted/30">
          <div className="container px-4">
            <motion.h2 
              className="text-3xl md:text-4xl font-bold mb-8 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              Career & Skills
            </motion.h2>
            
            <Career items={careerData || defaultCareer} />
            
            <motion.h3 
              className="text-2xl font-bold mt-16 mb-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Skills & Technologies
            </motion.h3>
            
            {/* Fixed: Updated from items={} to match what Skills expects */}
            <Skills skillItems={skillsData || defaultSkills} />
          </div>
        </section>
        
        <section id="contact" className="py-20">
          <div className="container px-4">
            <motion.h2 
              className="text-3xl md:text-4xl font-bold mb-8 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              Contact
            </motion.h2>
            
            {/* The Contact component doesn't accept these props directly, removing them */}
            <Contact />
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
