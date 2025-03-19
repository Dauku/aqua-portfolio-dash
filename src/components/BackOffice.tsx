
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  LogOut, 
  Home, 
  Briefcase, 
  User, 
  Mail, 
  Settings, 
  Save,
  Wrench,
  Loader2,
  CheckCircle
} from 'lucide-react';
import { useAuthStore } from '@/utils/auth';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';
import { airtableService } from '@/utils/airtable';

import BackOfficeDashboard from '@/components/BackOfficeDashboard';
import BackOfficePortfolio from '@/components/BackOfficePortfolio';
import BackOfficeCareer from '@/components/BackOfficeCareer';
import BackOfficeSkills from '@/components/BackOfficeSkills';
import BackOfficeContact from '@/components/BackOfficeContact';
import BackOfficeHero from '@/components/BackOfficeHero';
import BackOfficeSettings from '@/components/BackOfficeSettings';

const BackOffice = ({ airtableSchema }: { airtableSchema?: any }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  const navigate = useNavigate();
  const { logout, user } = useAuthStore();
  
  useEffect(() => {
    const storedApiKey = airtableService.getApiKey();
    const storedBaseId = airtableService.getBaseId();
    
    if (storedApiKey && storedBaseId) {
      setIsConnected(true);
    }
    
    setIsLoading(false);
  }, []);
  
  const handleLogout = () => {
    logout();
    navigate('/');
  };
  
  const handleSave = async () => {
    if (!isConnected) {
      toast({
        title: "Not Connected",
        description: "Please connect to Airtable first.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSaving(true);
    
    try {
      // The save functionality is now handled by each individual component
      setSaveSuccess(true);
      
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    } catch (error) {
      console.error("Error saving data:", error);
      toast({
        title: "Failed to Save",
        description: "Could not save data to Airtable. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p>Loading admin panel...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-background flex">
      <aside className="w-64 bg-aqua text-white shadow-lg hidden md:block">
        <div className="p-6 border-b border-white/10">
          <h2 className="text-xl font-bold flex items-center">
            <span className="mr-1 font-mono">&lt;</span>
            <span>BackOffice</span>
            <span className="ml-1 font-mono">/&gt;</span>
          </h2>
          <p className="text-sm mt-1 text-white/80">Content Management</p>
        </div>
        
        <nav className="p-4 space-y-1">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`w-full text-left p-3 rounded-md flex items-center transition-colors ${
              activeTab === 'dashboard' ? 'bg-white/20' : 'hover:bg-white/10'
            }`}
          >
            <Home className="h-5 w-5 mr-3" />
            Dashboard
          </button>
          
          <button
            onClick={() => setActiveTab('hero')}
            className={`w-full text-left p-3 rounded-md flex items-center transition-colors ${
              activeTab === 'hero' ? 'bg-white/20' : 'hover:bg-white/10'
            }`}
          >
            <Home className="h-5 w-5 mr-3" />
            Hero
          </button>
          
          <button
            onClick={() => setActiveTab('portfolio')}
            className={`w-full text-left p-3 rounded-md flex items-center transition-colors ${
              activeTab === 'portfolio' ? 'bg-white/20' : 'hover:bg-white/10'
            }`}
          >
            <Briefcase className="h-5 w-5 mr-3" />
            Portfolio
          </button>
          
          <button
            onClick={() => setActiveTab('career')}
            className={`w-full text-left p-3 rounded-md flex items-center transition-colors ${
              activeTab === 'career' ? 'bg-white/20' : 'hover:bg-white/10'
            }`}
          >
            <User className="h-5 w-5 mr-3" />
            Career
          </button>
          
          <button
            onClick={() => setActiveTab('skills')}
            className={`w-full text-left p-3 rounded-md flex items-center transition-colors ${
              activeTab === 'skills' ? 'bg-white/20' : 'hover:bg-white/10'
            }`}
          >
            <Wrench className="h-5 w-5 mr-3" />
            Skills
          </button>
          
          <button
            onClick={() => setActiveTab('contact')}
            className={`w-full text-left p-3 rounded-md flex items-center transition-colors ${
              activeTab === 'contact' ? 'bg-white/20' : 'hover:bg-white/10'
            }`}
          >
            <Mail className="h-5 w-5 mr-3" />
            Contact Info
          </button>
          
          <button
            onClick={() => setActiveTab('settings')}
            className={`w-full text-left p-3 rounded-md flex items-center transition-colors ${
              activeTab === 'settings' ? 'bg-white/20' : 'hover:bg-white/10'
            }`}
          >
            <Settings className="h-5 w-5 mr-3" />
            Settings
          </button>
        </nav>
        
        <div className="absolute bottom-0 w-64 p-4 border-t border-white/10">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <User className="h-6 w-6" />
            </div>
            <div className="ml-3">
              <p className="font-medium truncate">{user?.email}</p>
              <p className="text-xs text-white/70">Administrator</p>
            </div>
          </div>
          
          <button
            onClick={handleLogout}
            className="w-full p-2 bg-white/10 hover:bg-white/20 text-white rounded-md flex items-center justify-center transition-colors"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </button>
        </div>
      </aside>
      
      <div className="md:hidden fixed top-0 inset-x-0 bg-aqua text-white p-4 flex items-center justify-between z-50">
        <h2 className="text-lg font-bold">BackOffice</h2>
        <button
          onClick={handleLogout}
          className="p-2 bg-white/10 rounded-md"
        >
          <LogOut className="h-5 w-5" />
        </button>
      </div>
      
      <div className="md:hidden fixed bottom-0 inset-x-0 bg-aqua text-white p-2 flex justify-around z-50">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`p-2 rounded-md ${activeTab === 'dashboard' ? 'bg-white/20' : ''}`}
        >
          <Home className="h-6 w-6" />
        </button>
        
        <button
          onClick={() => setActiveTab('portfolio')}
          className={`p-2 rounded-md ${activeTab === 'portfolio' ? 'bg-white/20' : ''}`}
        >
          <Briefcase className="h-6 w-6" />
        </button>
        
        <button
          onClick={() => setActiveTab('career')}
          className={`p-2 rounded-md ${activeTab === 'career' ? 'bg-white/20' : ''}`}
        >
          <User className="h-6 w-6" />
        </button>
        
        <button
          onClick={() => setActiveTab('skills')}
          className={`p-2 rounded-md ${activeTab === 'skills' ? 'bg-white/20' : ''}`}
        >
          <Wrench className="h-6 w-6" />
        </button>
        
        <button
          onClick={() => setActiveTab('contact')}
          className={`p-2 rounded-md ${activeTab === 'contact' ? 'bg-white/20' : ''}`}
        >
          <Mail className="h-6 w-6" />
        </button>
      </div>
      
      <main className="flex-1 p-8 md:pt-8 pt-20 pb-24 md:pb-8 overflow-auto">
        <div className="max-w-5xl mx-auto">
          <div className="sticky top-0 z-40 py-4 bg-background flex justify-between items-center">
            <h1 className="text-2xl font-bold capitalize">{activeTab}</h1>
            <div className="flex items-center">
              {saveSuccess && (
                <motion.span
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-green-600 mr-4"
                >
                  <CheckCircle className="h-5 w-5 inline mr-1" />
                  Changes saved!
                </motion.span>
              )}
            </div>
          </div>
          
          {!isConnected && activeTab !== 'settings' && (
            <div className="bg-card shadow rounded-lg p-6 border border-border mb-6">
              <h2 className="text-xl font-bold mb-4">Connect to Airtable</h2>
              <p className="mb-4">Please go to Settings to configure your Airtable connection before editing content.</p>
              <button
                onClick={() => setActiveTab('settings')}
                className="px-4 py-2 bg-aqua text-white rounded-md text-sm"
              >
                Configure Connection
              </button>
            </div>
          )}
          
          {activeTab === 'dashboard' && (
            <BackOfficeDashboard airtableSchema={airtableSchema} />
          )}
          
          {activeTab === 'hero' && (
            <BackOfficeHero />
          )}
          
          {activeTab === 'portfolio' && (
            <BackOfficePortfolio />
          )}
          
          {activeTab === 'career' && (
            <BackOfficeCareer />
          )}
          
          {activeTab === 'skills' && (
            <BackOfficeSkills />
          )}
          
          {activeTab === 'contact' && (
            <BackOfficeContact />
          )}
          
          {activeTab === 'settings' && (
            <BackOfficeSettings airtableSchema={airtableSchema} />
          )}
        </div>
      </main>
    </div>
  );
};

export default BackOffice;
