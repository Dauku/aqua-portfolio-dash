
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BackOfficeComponent from '@/components/BackOffice';
import { useAuthStore } from '@/utils/auth';
import { airtableService } from '@/utils/airtable';
import AIRTABLE_SCHEMA from '@/utils/airtableSchema';
import { toast } from '@/components/ui/use-toast';

const BackOffice = () => {
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  
  // Set the Airtable API key when the component mounts (if not already set)
  useEffect(() => {
    // Check if API key is already set
    if (!airtableService.getApiKey()) {
      // Using the API key provided by the user
      const apiKey = "patLN8RdI0YEYkkeD.5697d7f1b8842e38b1ee8e3f3ce4fe4ecabc7a4699333a91e7787fe9715b2b29";
      airtableService.setApiKey(apiKey);
      
      toast({
        title: "Airtable API key set",
        description: "The application is now connected to Airtable.",
      });
    }
    
    // Set a default base ID if not already set
    if (!airtableService.getBaseId()) {
      airtableService.setBaseId("appLvD79J5G25NeeQ");
    }
  }, []);
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);
  
  if (!isAuthenticated) {
    return null;
  }
  
  return <BackOfficeComponent airtableSchema={AIRTABLE_SCHEMA} />;
};

export default BackOffice;
