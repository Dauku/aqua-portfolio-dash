
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BackOfficeComponent from '@/components/BackOffice';
import { useAuthStore } from '@/utils/auth';
import { airtableService } from '@/utils/airtable';
import AIRTABLE_SCHEMA from '@/utils/airtableSchema';
import { toast } from '@/components/ui/use-toast';

const BackOffice = () => {
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const [credentialsUpdated, setCredentialsUpdated] = useState(false);
  
  // Set the Airtable API key when the component mounts (if not already set)
  useEffect(() => {
    // Check if API key is already set
    const apiKey = localStorage.getItem('airtable_api_key');
    const baseId = localStorage.getItem('airtable_base_id');

    if (apiKey) {
      airtableService.setApiKey(apiKey);
      setCredentialsUpdated(true);
      console.log('API key loaded from localStorage in BackOffice');
    }
    
    if (baseId) {
      airtableService.setBaseId(baseId);
      console.log('Base ID loaded from localStorage in BackOffice:', baseId);
    } else {
      // Set a default base ID if not already set
      const defaultBaseId = "appLvD79J5G25NeeQ";
      airtableService.setBaseId(defaultBaseId);
      localStorage.setItem('airtable_base_id', defaultBaseId);
      console.log('Default Base ID set in BackOffice:', defaultBaseId);
    }
    
    // Make sure the data is saved to localStorage when it changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'airtable_api_key' && e.newValue) {
        airtableService.setApiKey(e.newValue);
        setCredentialsUpdated(true);
      } else if (e.key === 'airtable_base_id' && e.newValue) {
        airtableService.setBaseId(e.newValue);
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
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
