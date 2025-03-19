
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BackOfficeComponent from '@/components/BackOffice';
import { useAuthStore } from '@/utils/auth';
import { airtableService } from '@/utils/airtable';
import AIRTABLE_SCHEMA from '@/utils/airtableSchema';

const BackOffice = () => {
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  
  // Set the Airtable API key when the component mounts (if not already set)
  useEffect(() => {
    // Check if the key is already in localStorage
    const storedApiKey = localStorage.getItem('airtable_api_key');
    const storedBaseId = localStorage.getItem('airtable_base_id');
    
    // Only set demo values if nothing is stored yet
    if (!storedApiKey) {
      // Using the API key provided by the user
      airtableService.setApiKey("patLN8RdI0YEYkkeD.5697d7f1b8842e38b1ee8e3f3ce4fe4ecabc7a4699333a91e7787fe9715b2b29");
    }
    
    // Set a default base ID if not already set
    if (!storedBaseId) {
      airtableService.setBaseId("appLvD79J5G25NeeQ");
    }
  }, []);
  
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
