
import { useState, useEffect } from 'react';
import { Database, Loader2, Save, CheckCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { airtableService, HeroService } from '@/utils/airtable';

const BackOfficeSettings = ({ airtableSchema }: { airtableSchema?: any }) => {
  const [apiKey, setApiKey] = useState('');
  const [baseId, setBaseId] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isConfiguring, setIsConfiguring] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const storedApiKey = airtableService.getApiKey();
    const storedBaseId = airtableService.getBaseId();
    
    if (storedApiKey) {
      setApiKey(storedApiKey);
    }
    
    if (storedBaseId) {
      setBaseId(storedBaseId);
    }
    
    setIsConnected(!!(storedApiKey && storedBaseId));
  }, []);

  const handleConnect = async () => {
    if (!apiKey || !baseId) {
      toast({
        title: "Missing information",
        description: "Please enter both API key and Base ID.",
        variant: "destructive",
      });
      return;
    }
    
    setIsConfiguring(true);
    
    try {
      airtableService.setApiKey(apiKey);
      airtableService.setBaseId(baseId);
      
      // Test the connection by trying to get hero data
      const hero = await HeroService.get();
      
      setIsConnected(true);
      setShowSuccess(true);
      
      toast({
        title: "Connected to Airtable",
        description: "Successfully connected to your Airtable base.",
      });
      
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    } catch (error) {
      console.error("Error connecting to Airtable:", error);
      toast({
        title: "Connection Failed",
        description: "Could not connect to Airtable. Please check your API key and Base ID.",
        variant: "destructive",
      });
    } finally {
      setIsConfiguring(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-card shadow rounded-lg p-6 border border-border">
        <div className="flex items-center mb-4">
          <Database className="w-6 h-6 text-aqua mr-3" />
          <h3 className="text-lg font-bold">Airtable Connection</h3>
        </div>
        
        <div className="space-y-4 max-w-xl">
          <div>
            <label htmlFor="apiKey" className="block text-sm font-medium mb-1">
              Airtable API Key
            </label>
            <Input
              id="apiKey"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="pat..."
              type="password"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Generate a personal access token at{" "}
              <a 
                href="https://airtable.com/create/tokens" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-aqua hover:underline"
              >
                https://airtable.com/create/tokens
              </a>
            </p>
          </div>
          
          <div>
            <label htmlFor="baseId" className="block text-sm font-medium mb-1">
              Airtable Base ID
            </label>
            <Input
              id="baseId"
              value={baseId}
              onChange={(e) => setBaseId(e.target.value)}
              placeholder="app..."
            />
            <p className="text-xs text-muted-foreground mt-1">
              Find your base ID in the API documentation (it starts with "app").
            </p>
          </div>
          
          <div className="pt-2">
            <Button 
              onClick={handleConnect}
              disabled={isConfiguring}
              className="relative"
            >
              {isConfiguring ? (
                <span className="flex items-center">
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Connecting...
                </span>
              ) : showSuccess ? (
                <span className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Connected!
                </span>
              ) : (
                <span className="flex items-center">
                  <Save className="h-4 w-4 mr-2" />
                  {isConnected ? 'Update Connection' : 'Connect to Airtable'}
                </span>
              )}
            </Button>
            
            {isConnected && !showSuccess && (
              <span className="ml-3 text-sm">
                <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                Connected
              </span>
            )}
          </div>
        </div>
      </div>
      
      {airtableSchema && (
        <div className="bg-card shadow rounded-lg p-6 border border-border">
          <h2 className="text-xl font-bold mb-4">Airtable Schema Guide</h2>
          <p className="mb-4">Make sure your Airtable base has the following structure:</p>
          
          {airtableSchema}
        </div>
      )}
    </div>
  );
};

export default BackOfficeSettings;
