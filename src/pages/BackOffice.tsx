
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BackOfficeComponent from '@/components/BackOffice';
import { useAuthStore } from '@/utils/auth';

const BackOffice = () => {
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);
  
  if (!isAuthenticated) {
    return null;
  }
  
  return <BackOfficeComponent />;
};

export default BackOffice;
