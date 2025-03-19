
import { useState, useEffect } from 'react';
import { Loader2, Save } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { HeroService, HeroData } from '@/utils/airtable';

const BackOfficeHero = () => {
  const [heroData, setHeroData] = useState<HeroData>({
    title: '',
    subtitle: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadHeroData();
  }, []);

  const loadHeroData = async () => {
    try {
      setIsLoading(true);
      const hero = await HeroService.get();
      if (hero) {
        setHeroData(hero);
      }
    } catch (error) {
      console.error('Error loading hero data:', error);
      toast({
        title: "Failed to load hero section",
        description: "Could not load hero section data. Please check your connection.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: keyof HeroData, value: string) => {
    setHeroData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const savedHero = await HeroService.save(heroData);
      
      if (savedHero) {
        setHeroData(savedHero);
        
        toast({
          title: "Hero section saved",
          description: "Hero section has been saved successfully.",
        });
      }
    } catch (error) {
      console.error('Error saving hero data:', error);
      toast({
        title: "Failed to save",
        description: "Could not save hero section. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Hero Section</h2>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Hero Section
            </>
          )}
        </Button>
      </div>
      
      <div className="space-y-6 max-w-2xl">
        <div className="bg-card p-6 rounded-lg border">
          <div className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium mb-1">
                Main Title
              </label>
              <Input
                id="title"
                value={heroData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder="Design Development Perfection"
              />
            </div>
            
            <div>
              <label htmlFor="subtitle" className="block text-sm font-medium mb-1">
                Subtitle
              </label>
              <Textarea
                id="subtitle"
                value={heroData.subtitle}
                onChange={(e) => handleChange('subtitle', e.target.value)}
                placeholder="Creating elegant, functional digital experiences where design meets purpose and technology enables vision."
                rows={3}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BackOfficeHero;
