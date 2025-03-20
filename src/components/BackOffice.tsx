import { useState, useEffect } from 'react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "@/components/ui/use-toast"
import { HeroData, PortfolioItem, CareerItem, ContactInfo, SkillItem } from '@/utils/airtable';
import { HeroService, PortfolioService, CareerService, ContactService, SkillService } from '@/utils/airtable';
import { Eye, EyeOff, Plug } from 'lucide-react';

interface BackOfficeProps {
  airtableSchema: any;
}

const BackOfficeComponent = ({ airtableSchema }: BackOfficeProps) => {
  const [activeTab, setActiveTab] = useState("hero");
  const [isLoading, setIsLoading] = useState(false);
  
  // Hero Section
  const [heroData, setHeroData] = useState<HeroData>({ title: '', subtitle: '' });
  
  // Portfolio Section
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [activePortfolioItem, setActivePortfolioItem] = useState<PortfolioItem>({
    title: '',
    description: '',
    image: '',
    tags: [],
    link: '',
    github: '',
  });
  const [showPortfolioForm, setShowPortfolioForm] = useState(false);
  
  // Career Section
  const [careerItems, setCareerItems] = useState<CareerItem[]>([]);
  const [activeCareerItem, setActiveCareerItem] = useState<CareerItem>({
    title: '',
    company: '',
    location: '',
    period: '',
    description: '',
    type: 'work'
  });
  const [showCareerForm, setShowCareerForm] = useState(false);
  
  // Skills Section
  const [skillItems, setSkillItems] = useState<SkillItem[]>([]);
  const [activeSkillItem, setActiveSkillItem] = useState<SkillItem>({
    name: '',
    category: 'web',
    logoSvg: ''
  });
  const [showSkillForm, setShowSkillForm] = useState(false);
  
  // Contact Section
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    email: '',
    phone: '',
    location: '',
  });
  
  // Airtable Connection
  const [apiKey, setApiKey] = useState(localStorage.getItem('airtable_api_key') || '');
  const [baseId, setBaseId] = useState(localStorage.getItem('airtable_base_id') || '');
  const [showApiKey, setShowApiKey] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('Disconnected');

  // Check connection status when component mounts
  useEffect(() => {
    const apiKey = localStorage.getItem('airtable_api_key');
    const baseId = localStorage.getItem('airtable_base_id');
    
    if (apiKey && baseId) {
      setConnectionStatus('Connected');
    } else {
      setConnectionStatus('Disconnected');
    }
  }, []);

  // Fetch data functions
  const fetchHeroData = async () => {
    setIsLoading(true);
    try {
      const data = await HeroService.get();
      if (data) {
        setHeroData(data);
      }
    } catch (error) {
      console.error('Error fetching hero data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch hero data.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const fetchPortfolioItems = async () => {
    setIsLoading(true);
    try {
      const items = await PortfolioService.getAll();
      setPortfolioItems(items);
    } catch (error) {
      console.error('Error fetching portfolio items:', error);
      toast({
        title: "Error",
        description: "Failed to fetch portfolio items.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const fetchCareerItems = async () => {
    setIsLoading(true);
    try {
      const items = await CareerService.getAll();
      setCareerItems(items);
    } catch (error) {
      console.error('Error fetching career items:', error);
      toast({
        title: "Error",
        description: "Failed to fetch career items.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const fetchSkillItems = async () => {
    setIsLoading(true);
    try {
      const items = await SkillService.getAll();
      setSkillItems(items);
    } catch (error) {
      console.error('Error fetching skill items:', error);
      toast({
        title: "Error",
        description: "Failed to fetch skill items.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const fetchContactInfo = async () => {
    setIsLoading(true);
    try {
      const info = await ContactService.get();
      if (info) {
        setContactInfo(info);
      }
    } catch (error) {
      console.error('Error fetching contact info:', error);
      toast({
        title: "Error",
        description: "Failed to fetch contact info.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Save data functions
  const saveHeroData = async () => {
    setIsLoading(true);
    try {
      const savedData = await HeroService.save(heroData);
      if (savedData) {
        setHeroData(savedData);
        toast({
          title: "Hero data updated",
          description: "Hero section data has been updated successfully.",
        });
      } else {
        throw new Error("Failed to save hero data");
      }
    } catch (error) {
      console.error('Error saving hero data:', error);
      toast({
        title: "Error",
        description: "Failed to save hero data.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Update the updateAirtableConnection function to set the connection status
  const updateAirtableConnection = () => {
    try {
      if (apiKey && baseId) {
        airtableService.setApiKey(apiKey);
        airtableService.setBaseId(baseId);
        
        // Store in localStorage for persistence
        localStorage.setItem('airtable_api_key', apiKey);
        localStorage.setItem('airtable_base_id', baseId);
        
        setConnectionStatus('Connected');
        toast({
          title: "Connection updated",
          description: "Airtable connection has been updated successfully.",
        });
      } else {
        toast({
          title: "Invalid credentials",
          description: "Please provide both API key and Base ID.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error updating Airtable connection:', error);
      setConnectionStatus('Error');
      toast({
        title: "Connection failed",
        description: "Failed to connect to Airtable. Please check your credentials.",
        variant: "destructive",
      });
    }
  };

  // Update handleTabChange to fetch data for the selected tab
  const handleTabChange = (value) => {
    setActiveTab(value);
    
    // Load data based on the selected tab
    if (value === 'hero') {
      fetchHeroData();
    } else if (value === 'portfolio') {
      fetchPortfolioItems();
    } else if (value === 'career') {
      fetchCareerItems();
    } else if (value === 'skills') {
      fetchSkillItems();
    } else if (value === 'contact') {
      fetchContactInfo();
    }
  };
  
  // Portfolio item CRUD operations
  const addPortfolioItem = () => {
    setActivePortfolioItem({
      title: '',
      description: '',
      image: '',
      tags: [],
      link: '',
      github: '',
    });
    setShowPortfolioForm(true);
  };
  
  const editPortfolioItem = (item) => {
    setActivePortfolioItem({ ...item });
    setShowPortfolioForm(true);
  };
  
  const savePortfolioItem = async () => {
    setIsLoading(true);
    try {
      const savedItem = await PortfolioService.save(activePortfolioItem);
      if (savedItem) {
        if (activePortfolioItem.id) {
          // Update existing item
          setPortfolioItems(prevItems =>
            prevItems.map(item => item.id === savedItem.id ? savedItem : item)
          );
          toast({
            title: "Portfolio item updated",
            description: "Portfolio item has been updated successfully.",
          });
        } else {
          // Add new item
          setPortfolioItems(prevItems => [...prevItems, savedItem]);
          toast({
            title: "Portfolio item added",
            description: "Portfolio item has been added successfully.",
          });
        }
        setShowPortfolioForm(false);
      } else {
        throw new Error("Failed to save portfolio item");
      }
    } catch (error) {
      console.error('Error saving portfolio item:', error);
      toast({
        title: "Error",
        description: "Failed to save portfolio item.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Fix the portfolio item deletion
  const deletePortfolioItem = async (id) => {
    setIsLoading(true);
    try {
      const success = await PortfolioService.delete(id);
      if (success) {
        setPortfolioItems(prevItems => prevItems.filter(item => item.id !== id));
        toast({
          title: "Portfolio item deleted",
          description: "Portfolio item has been deleted successfully.",
        });
      } else {
        throw new Error("Failed to delete portfolio item");
      }
    } catch (error) {
      console.error('Error deleting portfolio item:', error);
      toast({
        title: "Error",
        description: "Failed to delete portfolio item.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Fix the career item CRUD operations
  const addCareerItem = async () => {
    setIsLoading(true);
    try {
      // Reset form with empty values before adding
      setActiveCareerItem({
        title: '',
        company: '',
        location: '',
        period: '',
        description: '',
        type: 'work'
      });
      setShowCareerForm(true);
    } catch (error) {
      console.error('Error preparing to add career item:', error);
      toast({
        title: "Error",
        description: "Failed to prepare career form.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const editCareerItem = (item) => {
    setActiveCareerItem({ ...item });
    setShowCareerForm(true);
  };

  const saveCareerItem = async () => {
    setIsLoading(true);
    try {
      const savedItem = await CareerService.save(activeCareerItem);
      if (savedItem) {
        if (activeCareerItem.id) {
          // Update existing item
          setCareerItems(prevItems => 
            prevItems.map(item => item.id === savedItem.id ? savedItem : item)
          );
          toast({
            title: "Career item updated",
            description: "Career item has been updated successfully.",
          });
        } else {
          // Add new item
          setCareerItems(prevItems => [...prevItems, savedItem]);
          toast({
            title: "Career item added",
            description: "Career item has been added successfully.",
          });
        }
        setShowCareerForm(false);
      } else {
        throw new Error("Failed to save career item");
      }
    } catch (error) {
      console.error('Error saving career item:', error);
      toast({
        title: "Error",
        description: "Failed to save career item.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const deleteCareerItem = async (id) => {
    setIsLoading(true);
    try {
      const success = await CareerService.delete(id);
      if (success) {
        setCareerItems(prevItems => prevItems.filter(item => item.id !== id));
        toast({
          title: "Career item deleted",
          description: "Career item has been deleted successfully.",
        });
      } else {
        throw new Error("Failed to delete career item");
      }
    } catch (error) {
      console.error('Error deleting career item:', error);
      toast({
        title: "Error",
        description: "Failed to delete career item.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Fix the skills CRUD operations
  const addSkillItem = () => {
    setActiveSkillItem({
      name: '',
      category: 'web',
      logoSvg: ''
    });
    setShowSkillForm(true);
  };

  const editSkillItem = (item) => {
    setActiveSkillItem({ ...item });
    setShowSkillForm(true);
  };

  const saveSkillItem = async () => {
    setIsLoading(true);
    try {
      const savedItem = await SkillService.save(activeSkillItem);
      if (savedItem) {
        if (activeSkillItem.id) {
          // Update existing item
          setSkillItems(prevItems => 
            prevItems.map(item => item.id === savedItem.id ? savedItem : item)
          );
          toast({
            title: "Skill item updated",
            description: "Skill item has been updated successfully.",
          });
        } else {
          // Add new item
          setSkillItems(prevItems => [...prevItems, savedItem]);
          toast({
            title: "Skill item added",
            description: "Skill item has been added successfully.",
          });
        }
        setShowSkillForm(false);
      } else {
        throw new Error("Failed to save skill item");
      }
    } catch (error) {
      console.error('Error saving skill item:', error);
      toast({
        title: "Error",
        description: "Failed to save skill item.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const deleteSkillItem = async (id) => {
    setIsLoading(true);
    try {
      const success = await SkillService.delete(id);
      if (success) {
        setSkillItems(prevItems => prevItems.filter(item => item.id !== id));
        toast({
          title: "Skill item deleted",
          description: "Skill item has been deleted successfully.",
        });
      } else {
        throw new Error("Failed to delete skill item");
      }
    } catch (error) {
      console.error('Error deleting skill item:', error);
      toast({
        title: "Error",
        description: "Failed to delete skill item.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Fix the contact info save
  const saveContactInfo = async () => {
    setIsLoading(true);
    try {
      const savedInfo = await ContactService.save(contactInfo);
      if (savedInfo) {
        setContactInfo(savedInfo);
        toast({
          title: "Contact info updated",
          description: "Contact information has been updated successfully.",
        });
      } else {
        throw new Error("Failed to save contact info");
      }
    } catch (error) {
      console.error('Error saving contact info:', error);
      toast({
        title: "Error",
        description: "Failed to save contact information.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="hero">Hero</TabsTrigger>
          <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
          <TabsTrigger value="career">Career</TabsTrigger>
          <TabsTrigger value="skills">Skills</TabsTrigger>
          <TabsTrigger value="contact">Contact</TabsTrigger>
        </TabsList>
      
      <TabsContent value="settings" className="space-y-6">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold">Settings</h2>
          <p className="text-muted-foreground">Configure your portfolio settings.</p>
        </div>
        
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Airtable Connection</CardTitle>
                <CardDescription>Connect your portfolio to Airtable to store and manage your content.</CardDescription>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Plug className="w-4 h-4" />
                <span className={connectionStatus === 'Connected' ? 'text-green-500' : 'text-red-500'}>
                  Current Status: {connectionStatus}
                </span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="api-key">Airtable API Key</Label>
              <div className="relative">
                <Input
                  id="api-key"
                  type={showApiKey ? "text" : "password"}
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Enter your Airtable API key"
                />
                <button 
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  onClick={() => setShowApiKey(!showApiKey)}
                >
                  {showApiKey ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <p className="text-xs text-muted-foreground">
                Create a Personal Access Token with scopes: data.records:read, data.records:write
              </p>
            </div>
            
            <div className="space-y-1">
              <Label htmlFor="base-id">Airtable Base ID</Label>
              <Input
                id="base-id"
                value={baseId}
                onChange={(e) => setBaseId(e.target.value)}
                placeholder="Enter your Airtable Base ID"
              />
              <p className="text-xs text-muted-foreground">
                Find this in your Airtable API documentation. It starts with "app".
              </p>
            </div>
            
            <Button 
              onClick={updateAirtableConnection} 
              disabled={isLoading || !apiKey || !baseId}
            >
              Update Connection
            </Button>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="hero" className="space-y-6">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold">Hero Section</h2>
          <p className="text-muted-foreground">Update the main hero section of your portfolio.</p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Hero Content</CardTitle>
            <CardDescription>Edit the title and subtitle of your hero section.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="hero-title">Title</Label>
              <Input
                id="hero-title"
                value={heroData.title}
                onChange={(e) => setHeroData({ ...heroData, title: e.target.value })}
                placeholder="Enter your title"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="hero-subtitle">Subtitle</Label>
              <Textarea
                id="hero-subtitle"
                value={heroData.subtitle}
                onChange={(e) => setHeroData({ ...heroData, subtitle: e.target.value })}
                placeholder="Enter your subtitle"
                rows={3}
              />
            </div>
            
            <Button onClick={saveHeroData} disabled={isLoading}>
              Save Changes
            </Button>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="portfolio" className="space-y-6">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold">Portfolio Items</h2>
          <p className="text-muted-foreground">Manage your portfolio items.</p>
        </div>
        
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Portfolio Items</CardTitle>
              <Button onClick={addPortfolioItem} disabled={isLoading}>Add Item</Button>
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px] w-full rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px]">Title</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {portfolioItems.map(item => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.title}</TableCell>
                      <TableCell>{item.description}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="secondary" size="sm" onClick={() => editPortfolioItem(item)} disabled={isLoading}>Edit</Button>
                        <Button variant="destructive" size="sm" onClick={() => deletePortfolioItem(item.id)} disabled={isLoading}>Delete</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </CardContent>
        </Card>
        
        {showPortfolioForm && (
          <Card>
            <CardHeader>
              <CardTitle>{activePortfolioItem.id ? 'Edit Portfolio Item' : 'Add Portfolio Item'}</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="portfolio-title">Title</Label>
                    <Input
                      id="portfolio-title"
                      value={activePortfolioItem.title}
                      onChange={(e) => setActivePortfolioItem({...activePortfolioItem, title: e.target.value})}
                      placeholder="Project title"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="portfolio-image">Image URL</Label>
                    <Input
                      id="portfolio-image"
                      value={activePortfolioItem.image}
                      onChange={(e) => setActivePortfolioItem({...activePortfolioItem, image: e.target.value})}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="portfolio-description">Description</Label>
                  <Textarea
                    id="portfolio-description"
                    value={activePortfolioItem.description}
                    onChange={(e) => setActivePortfolioItem({...activePortfolioItem, description: e.target.value})}
                    placeholder="Short project description"
                    rows={3}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="portfolio-tags">Tags (comma separated)</Label>
                    <Input
                      id="portfolio-tags"
                      value={Array.isArray(activePortfolioItem.tags) ? activePortfolioItem.tags.join(', ') : ''}
                      onChange={(e) => setActivePortfolioItem({
                        ...activePortfolioItem, 
                        tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag)
                      })}
                      placeholder="React, Web, UI/UX"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="portfolio-link">Live Demo URL</Label>
                    <Input
                      id="portfolio-link"
                      value={activePortfolioItem.link || ''}
                      onChange={(e) => setActivePortfolioItem({...activePortfolioItem, link: e.target.value})}
                      placeholder="https://example.com"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="portfolio-github">GitHub URL</Label>
                    <Input
                      id="portfolio-github"
                      value={activePortfolioItem.github || ''}
                      onChange={(e) => setActivePortfolioItem({...activePortfolioItem, github: e.target.value})}
                      placeholder="https://github.com/username/repo"
                    />
                  </div>
                </div>
                
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setShowPortfolioForm(false)}>Cancel</Button>
                  <Button onClick={savePortfolioItem} disabled={isLoading}>Save</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}
      </TabsContent>
      
      <TabsContent value="career" className="space-y-6">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold">Career Journey</h2>
          <p className="text-muted-foreground">Manage your career journey items.</p>
        </div>
        
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Career Items</CardTitle>
              <Button onClick={addCareerItem} disabled={isLoading}>Add Item</Button>
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px] w-full rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px]">Title</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {careerItems.map(item => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.title}</TableCell>
                      <TableCell>{item.company}</TableCell>
                      <TableCell>{item.type}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="secondary" size="sm" onClick={() => editCareerItem(item)} disabled={isLoading}>Edit</Button>
                        <Button variant="destructive" size="sm" onClick={() => deleteCareerItem(item.id)} disabled={isLoading}>Delete</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </CardContent>
        </Card>
        
        {showCareerForm && (
          <Card>
            <CardHeader>
              <CardTitle>{activeCareerItem.id ? 'Edit Career Item' : 'Add Career Item'}</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="career-title">Title</Label>
                    <Input
                      id="career-title"
                      value={activeCareerItem.title}
                      onChange={(e) => setActiveCareerItem({...activeCareerItem, title: e.target.value})}
                      placeholder="Job title or degree"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="career-company">Company/Institution</Label>
                    <Input
                      id="career-company"
                      value={activeCareerItem.company}
                      onChange={(e) => setActiveCareerItem({...activeCareerItem, company: e.target.value})}
                      placeholder="Company or university name"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="career-location">Location</Label>
                    <Input
                      id="career-location"
                      value={activeCareerItem.location}
                      onChange={(e) => setActiveCareerItem({...activeCareerItem, location: e.target.value})}
                      placeholder="City, Country"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="career-period">Period</Label>
                    <Input
                      id="career-period"
                      value={activeCareerItem.period}
                      onChange={(e) => setActiveCareerItem({...activeCareerItem, period: e.target.value})}
                      placeholder="2020 - Present"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="career-description">Description</Label>
                  <Textarea
                    id="career-description"
                    value={activeCareerItem.description}
                    onChange={(e) => setActiveCareerItem({...activeCareerItem, description: e.target.value})}
                    placeholder="Describe your role and achievements"
                    rows={3}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="career-type">Type</Label>
                  <Select 
                    value={activeCareerItem.type} 
                    onValueChange={(value) => setActiveCareerItem({...activeCareerItem, type: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="work">Work Experience</SelectItem>
                      <SelectItem value="education">Education</SelectItem>
                      <SelectItem value="achievement">Achievement</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setShowCareerForm(false)}>Cancel</Button>
                  <Button onClick={saveCareerItem} disabled={isLoading}>Save</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}
      </TabsContent>
      
      <TabsContent value="skills" className="space-y-6">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold">Skills & Technologies</h2>
          <p className="text-muted-foreground">Manage your skills and technologies.</p>
        </div>
        
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Skills</CardTitle>
              <Button onClick={addSkillItem} disabled={isLoading}>Add Skill</Button>
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px] w-full rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px]">Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {skillItems.map(item => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>{item.category}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="secondary" size="sm" onClick={() => editSkillItem(item)} disabled={isLoading}>Edit</Button>
                        <Button variant="destructive" size="sm" onClick={() => deleteSkillItem(item.id)} disabled={isLoading}>Delete</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </CardContent>
        </Card>
        
        {showSkillForm && (
          <Card>
            <CardHeader>
              <CardTitle>{activeSkillItem.id ? 'Edit Skill' : 'Add Skill'}</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="skill-name">Skill Name</Label
