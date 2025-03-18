
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import Hero from '@/components/Hero';
import Portfolio from '@/components/Portfolio';
import Career from '@/components/Career';
import Contact from '@/components/Contact';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { HeroService, PortfolioService, CareerService, ContactService, SkillService } from '@/utils/airtable';
import { Loader2 } from 'lucide-react';

const Index = () => {
  const [isDataReady, setIsDataReady] = useState(false);
  
  const { data: heroData, isLoading: isHeroLoading } = useQuery({
    queryKey: ['hero'],
    queryFn: () => HeroService.get(),
  });
  
  const { data: portfolioData, isLoading: isPortfolioLoading } = useQuery({
    queryKey: ['portfolio'],
    queryFn: () => PortfolioService.getAll(),
  });
  
  const { data: careerData, isLoading: isCareerLoading } = useQuery({
    queryKey: ['career'],
    queryFn: () => CareerService.getAll(),
  });
  
  const { data: contactData, isLoading: isContactLoading } = useQuery({
    queryKey: ['contact'],
    queryFn: () => ContactService.get(),
  });
  
  const { data: skillsData, isLoading: isSkillsLoading } = useQuery({
    queryKey: ['skills'],
    queryFn: () => SkillService.getAll(),
  });
  
  // Check if all data is loaded
  useEffect(() => {
    if (!isHeroLoading && !isPortfolioLoading && !isCareerLoading && !isContactLoading && !isSkillsLoading) {
      setIsDataReady(true);
    }
  }, [isHeroLoading, isPortfolioLoading, isCareerLoading, isContactLoading, isSkillsLoading]);
  
  if (!isDataReady) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p>Loading portfolio...</p>
        </div>
      </div>
    );
  }
  
  return (
    <>
      <Navbar />
      <Hero data={heroData} />
      <Portfolio items={portfolioData} />
      <Career careerItems={careerData} skillItems={skillsData} />
      <Contact data={contactData} />
      <Footer />
    </>
  );
};

export default Index;
