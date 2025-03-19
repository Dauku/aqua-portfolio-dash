
import { useEffect, useState } from 'react';
import { Database, Users, Image, Briefcase, FileCode } from 'lucide-react';
import { airtableService } from '@/utils/airtable';

interface Stats {
  portfolioItems: number;
  careerItems: number;
  skillItems: number;
  isConnected: boolean;
}

const BackOfficeDashboard = ({ airtableSchema }: { airtableSchema?: any }) => {
  const [stats, setStats] = useState<Stats>({
    portfolioItems: 0,
    careerItems: 0,
    skillItems: 0,
    isConnected: false
  });

  useEffect(() => {
    const storedApiKey = airtableService.getApiKey();
    const storedBaseId = airtableService.getBaseId();
    
    setStats(prev => ({
      ...prev,
      isConnected: !!(storedApiKey && storedBaseId)
    }));
    
    // Load counts from localStorage if available
    const portfolioData = localStorage.getItem('portfolio_data');
    const careerData = localStorage.getItem('career_data');
    const skillsData = localStorage.getItem('skills_data');
    
    if (portfolioData) {
      try {
        const items = JSON.parse(portfolioData);
        setStats(prev => ({ ...prev, portfolioItems: items.length }));
      } catch (e) {}
    }
    
    if (careerData) {
      try {
        const items = JSON.parse(careerData);
        setStats(prev => ({ ...prev, careerItems: items.length }));
      } catch (e) {}
    }
    
    if (skillsData) {
      try {
        const items = JSON.parse(skillsData);
        setStats(prev => ({ ...prev, skillItems: items.length }));
      } catch (e) {}
    }
  }, []);

  return (
    <div className="space-y-6">
      {airtableSchema && (
        <div className="bg-card shadow rounded-lg p-6 border border-border mb-6">
          <h2 className="text-xl font-bold mb-4">Airtable Schema Guide</h2>
          <p className="mb-4">To use this application, set up your Airtable base with the following structure:</p>
          
          {airtableSchema}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card shadow rounded-lg p-6 border border-border">
          <div className="flex items-center mb-4">
            <Briefcase className="w-8 h-8 text-aqua mr-3" />
            <h3 className="text-lg font-bold">Portfolio Items</h3>
          </div>
          <p className="text-3xl font-bold">{stats.portfolioItems}</p>
          <p className="text-muted-foreground mt-1">Projects in your portfolio</p>
        </div>
        
        <div className="bg-card shadow rounded-lg p-6 border border-border">
          <div className="flex items-center mb-4">
            <Users className="w-8 h-8 text-aqua mr-3" />
            <h3 className="text-lg font-bold">Career Items</h3>
          </div>
          <p className="text-3xl font-bold">{stats.careerItems}</p>
          <p className="text-muted-foreground mt-1">Positions in your timeline</p>
        </div>
        
        <div className="bg-card shadow rounded-lg p-6 border border-border">
          <div className="flex items-center mb-4">
            <FileCode className="w-8 h-8 text-aqua mr-3" />
            <h3 className="text-lg font-bold">Skills</h3>
          </div>
          <p className="text-3xl font-bold">{stats.skillItems}</p>
          <p className="text-muted-foreground mt-1">Skills & technologies</p>
        </div>
      </div>
      
      <div className="bg-card shadow rounded-lg p-6 border border-border">
        <div className="flex items-center mb-4">
          <Database className="w-8 h-8 text-aqua mr-3" />
          <h3 className="text-lg font-bold">Airtable Connection</h3>
        </div>
        
        <div className="flex items-center">
          <div className={`w-3 h-3 rounded-full mr-2 ${stats.isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <p>{stats.isConnected ? 'Connected to Airtable' : 'Not connected to Airtable'}</p>
        </div>
        
        {stats.isConnected && (
          <div className="mt-4 text-sm text-muted-foreground">
            <p>Base ID: {airtableService.getBaseId()}</p>
            <p>API Key: {airtableService.getApiKey().substr(0, 6)}...{airtableService.getApiKey().substr(-4)}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BackOfficeDashboard;
