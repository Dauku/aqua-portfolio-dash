import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { HeroService, ContactService, SkillService, airtableService } from '@/utils/airtable';
import { toast } from '@/components/ui/use-toast';

import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import Skills from '@/components/Skills';
import { Skeleton } from '@/components/ui/skeleton';
import { CareerJourney } from '@/components/CareerJourney';

const Index = () => {
  // Initialize airtable service with stored credentials
  useEffect(() => {
    // Check if API key is already set in the service
    if (!airtableService.getApiKey()) {
      // Try to get from localStorage (set by BackOffice)
      const storedApiKey = localStorage.getItem('airtable_api_key');
      if (storedApiKey) {
        airtableService.setApiKey(storedApiKey);
        console.log('Retrieved and set API key from localStorage');
      } else {
        console.error('No Airtable API key found in localStorage');
        toast({
          title: "Airtable Connection Error",
          description: "API key not found. Please set it in the Back Office first.",
          variant: "destructive",
        });
      }
    }
    
    // Check if Base ID is already set in the service
    if (!airtableService.getBaseId() || airtableService.getBaseId() === 'appXXXXXXXXXXXXXX') {
      // Try to get from localStorage (set by BackOffice)
      const storedBaseId = localStorage.getItem('airtable_base_id');
      if (storedBaseId) {
        airtableService.setBaseId(storedBaseId);
        console.log('Retrieved and set Base ID from localStorage:', storedBaseId);
      } else {
        console.error('No Airtable Base ID found in localStorage');
        toast({
          title: "Airtable Connection Error",
          description: "Base ID not found. Please set it in the Back Office first.",
          variant: "destructive",
        });
      }
    }
  }, []);
  
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
    const errors = [heroError, skillsError, contactError].filter(Boolean);
    if (errors.length > 0) {
      toast({
        title: "Error loading data",
        description: "Some content couldn't be loaded. Please check Airtable connection in Back Office.",
        variant: "destructive",
      });
    }
  }, [heroError, skillsError, contactError]);
  
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
              title={heroData?.title} 
              subtitle={heroData?.subtitle} 
            />
          )}
        </section>
        
        {/* Career Journey section */}
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
            
            <CareerJourney />
            
            {/* Skills & Expertise section */}
            <motion.h3 
              className="text-2xl font-bold mt-16 mb-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Skills & Technologies
            </motion.h3>
            
            <Skills skillItems={skillsData || []} />
          </div>
        </section>
        
        {/* Contact section - Only show if contact data is available */}
        {!contactLoading && contactData && (
          <section id="contact" className="py-20">
            <div className="container px-4">
              <motion.h2 
                className="text-3xl md:text-4xl font-bold mb-8 text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                Contact Me
              </motion.h2>
              
              <Contact 
                email={contactData?.email || "hello@example.com"} 
                phone={contactData?.phone || "+1 (234) 567-890"} 
                location={contactData?.location || "San Francisco, CA"} 
              />
            </div>
          </section>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
