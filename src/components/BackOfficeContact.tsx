
import { useState, useEffect } from 'react';
import { Loader2, Save } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { ContactService, ContactInfo } from '@/utils/airtable';

const BackOfficeContact = () => {
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    email: '',
    phone: '',
    location: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadContactInfo();
  }, []);

  const loadContactInfo = async () => {
    try {
      setIsLoading(true);
      const contact = await ContactService.get();
      if (contact) {
        setContactInfo(contact);
      }
    } catch (error) {
      console.error('Error loading contact info:', error);
      toast({
        title: "Failed to load contact info",
        description: "Could not load contact information. Please check your connection.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: keyof ContactInfo, value: string) => {
    setContactInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const savedContact = await ContactService.save(contactInfo);
      
      if (savedContact) {
        setContactInfo(savedContact);
        
        toast({
          title: "Contact info saved",
          description: "Contact information has been saved successfully.",
        });
      }
    } catch (error) {
      console.error('Error saving contact info:', error);
      toast({
        title: "Failed to save",
        description: "Could not save contact information. Please try again.",
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
        <h2 className="text-xl font-bold">Contact Information</h2>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Contact Info
            </>
          )}
        </Button>
      </div>
      
      <div className="space-y-6 max-w-2xl">
        <div className="bg-card p-6 rounded-lg border">
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                Email Address
              </label>
              <Input
                id="email"
                type="email"
                value={contactInfo.email}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="hello@example.com"
              />
            </div>
            
            <div>
              <label htmlFor="phone" className="block text-sm font-medium mb-1">
                Phone Number
              </label>
              <Input
                id="phone"
                type="tel"
                value={contactInfo.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                placeholder="+1 (234) 567-890"
              />
            </div>
            
            <div>
              <label htmlFor="location" className="block text-sm font-medium mb-1">
                Location
              </label>
              <Input
                id="location"
                value={contactInfo.location}
                onChange={(e) => handleChange('location', e.target.value)}
                placeholder="San Francisco, CA"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BackOfficeContact;
