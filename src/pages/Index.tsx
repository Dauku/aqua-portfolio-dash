
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { HeroService, ContactService, SkillService } from '@/utils/airtable';
import { toast } from '@/components/ui/use-toast';

import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import Skills from '@/components/Skills';
import { Skeleton } from '@/components/ui/skeleton';
import { CareerJourney } from '@/components/CareerJourney';

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
    const errors = [heroError, contactError, skillsError].filter(Boolean);
    if (errors.length > 0) {
      toast({
        title: "Error loading data",
        description: "Some content couldn't be loaded. Please try again later.",
        variant: "destructive",
      });
    }
  }, [heroError, contactError, skillsError]);
  
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
            {!skillsLoading && skillsData && skillsData.length > 0 && (
              <>
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
              </>
            )}
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
