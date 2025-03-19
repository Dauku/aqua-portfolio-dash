
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from '@/components/ui/use-toast';
import { 
  LogOut, 
  Home, 
  Briefcase, 
  User, 
  Mail, 
  Settings, 
  Save,
  Image,
  Edit,
  Trash2,
  Database,
  Loader2,
  Wrench,
  CheckCircle,
  FileSpreadsheet,
  Table2,
  Grid3X3,
  Upload
} from 'lucide-react';
import { useAuthStore } from '@/utils/auth';
import { 
  airtableService, 
  HeroService, 
  PortfolioService, 
  CareerService, 
  ContactService, 
  SkillService,
  HeroData,
  PortfolioItem,
  CareerItem,
  ContactInfo,
  SkillItem
} from '@/utils/airtable';
import { Input } from '@/components/ui/input';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const BackOffice = ({ airtableSchema }: { airtableSchema?: any }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [data, setData] = useState<{
    hero: HeroData;
    portfolio: PortfolioItem[];
    career: CareerItem[];
    contact: ContactInfo;
    skills: SkillItem[];
  }>({
    hero: {
      title: '',
      subtitle: '',
    },
    portfolio: [],
    career: [],
    contact: {
      email: '',
      phone: '',
      location: '',
    },
    skills: []
  });
  
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [apiKey, setApiKey] = useState(airtableService.getApiKey() || '');
  const [baseId, setBaseId] = useState(airtableService.getBaseId() || '');
  const [isConnected, setIsConnected] = useState(false);
  const [isConfiguring, setIsConfiguring] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [uploadingIndex, setUploadingIndex] = useState<string | null>(null);

  const navigate = useNavigate();
  const { logout, user } = useAuthStore();
  
  const connectToAirtable = async () => {
    setIsConfiguring(true);
    
    try {
      airtableService.setApiKey(apiKey);
      airtableService.setBaseId(baseId);
      
      const hero = await HeroService.get();
      setIsConnected(true);
      toast({
        title: "Connected to Airtable",
        description: "Successfully connected to your Airtable base.",
      });
      
      loadAllData();
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
  
  const loadAllData = async () => {
    setIsLoading(true);
    
    try {
      const hero = await HeroService.get();
      
      const portfolio = await PortfolioService.getAll();
      
      const career = await CareerService.getAll();
      
      const contact = await ContactService.get();
      
      const skills = await SkillService.getAll();
      
      setData({
        hero: hero || { title: 'Design Development Perfection', subtitle: 'Creating elegant, functional digital experiences where design meets purpose and technology enables vision.' },
        portfolio: portfolio.length > 0 ? portfolio : [
          {
            title: "E-Commerce Dashboard",
            description: "A comprehensive dashboard for online retail management with real-time analytics and inventory tracking.",
            image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000&auto=format&fit=crop",
            tags: ["React", "Tailwind CSS", "Node.js"],
            link: "#",
            github: "#"
          },
          {
            title: "Financial App UI",
            description: "A clean, intuitive mobile banking application interface designed for optimal user experience.",
            image: "https://images.unsplash.com/photo-1579621970795-87facc2f976d?q=80&w=1000&auto=format&fit=crop",
            tags: ["UI/UX", "Figma", "Swift"],
            link: "#",
            github: "#"
          },
          {
            title: "Travel Agency Website",
            description: "A responsive website for a travel agency with booking functionality and destination guides.",
            image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=1000&auto=format&fit=crop",
            tags: ["TypeScript", "Next.js", "Prisma"],
            link: "#",
            github: "#"
          }
        ],
        career: career.length > 0 ? career : [
          {
            title: 'Senior Frontend Developer',
            company: 'TechNova Solutions',
            location: 'San Francisco, CA',
            period: '2020 - Present',
            description: 'Led the frontend development team in creating responsive, accessible web applications.',
            type: 'work',
          },
          {
            title: 'Master in Computer Science',
            company: 'Stanford University',
            location: 'Stanford, CA',
            period: '2018 - 2020',
            description: 'Specialized in Human-Computer Interaction and User Experience Design.',
            type: 'education',
          }
        ],
        contact: contact || {
          email: 'hello@example.com',
          phone: '+1 (234) 567-890',
          location: 'San Francisco, CA',
        },
        skills: skills
      });
      
      setIsConnected(true);
    } catch (error) {
      console.error("Error loading data:", error);
      toast({
        title: "Failed to Load Data",
        description: "Could not load data from Airtable. Please check your connection.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    const storedApiKey = airtableService.getApiKey();
    const storedBaseId = airtableService.getBaseId();
    
    if (storedApiKey && storedBaseId) {
      setApiKey(storedApiKey);
      setBaseId(storedBaseId);
      setIsConnected(true);
      loadAllData();
    } else {
      setIsLoading(false);
    }
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
      await HeroService.save(data.hero);
      
      for (const item of data.portfolio) {
        await PortfolioService.save(item);
      }
      
      for (const item of data.career) {
        await CareerService.save(item);
      }
      
      await ContactService.save(data.contact);
      
      for (const item of data.skills) {
        await SkillService.save(item);
      }
      
      setSaveSuccess(true);
      toast({
        title: "Saved Successfully",
        description: "All changes have been saved to Airtable.",
      });
      
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
  
  const handleChange = (section: string, field: string, value: string) => {
    setData(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [field]: value
      }
    }));
  };
  
  const handlePortfolioItemChange = (id: string | undefined, field: string, value: any) => {
    setData(prev => ({
      ...prev,
      portfolio: prev.portfolio.map(item => 
        item.id === id ? { ...item, [field]: value } : item
      )
    }));
  };
  
  const handleCareerItemChange = (id: string | undefined, field: string, value: string) => {
    setData(prev => ({
      ...prev,
      career: prev.career.map(item => 
        item.id === id ? { ...item, [field]: value } : item
      )
    }));
  };
  
  const handleAddPortfolioItem = () => {
    const newItem: PortfolioItem = {
      title: "New Project",
      description: "Project description",
      image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=1000&auto=format&fit=crop",
      tags: ["Tag 1", "Tag 2"],
    };
    
    setData(prev => ({
      ...prev,
      portfolio: [...prev.portfolio, newItem]
    }));
    
    setEditingItemId("new");
  };
  
  const handleDeletePortfolioItem = async (id: string | undefined) => {
    if (!id) {
      setData(prev => ({
        ...prev,
        portfolio: prev.portfolio.filter(item => item.id !== id)
      }));
      return;
    }
    
    try {
      await PortfolioService.delete(id);
      
      setData(prev => ({
        ...prev,
        portfolio: prev.portfolio.filter(item => item.id !== id)
      }));
      
      if (editingItemId === id) {
        setEditingItemId(null);
      }
      
      toast({
        title: "Item Deleted",
        description: "Portfolio item has been deleted.",
      });
    } catch (error) {
      console.error("Error deleting portfolio item:", error);
      toast({
        title: "Failed to Delete",
        description: "Could not delete portfolio item. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const handleAddCareerItem = () => {
    const newItem: CareerItem = {
      title: 'New Position',
      company: 'Company Name',
      location: 'Location',
      period: '2023 - Present',
      description: 'Description',
      type: 'work',
    };
    
    setData(prev => ({
      ...prev,
      career: [...prev.career, newItem]
    }));
    
    setEditingItemId("new");
  };
  
  const handleDeleteCareerItem = async (id: string | undefined) => {
    if (!id) {
      setData(prev => ({
        ...prev,
        career: prev.career.filter(item => item.id !== id)
      }));
      return;
    }
    
    try {
      await CareerService.delete(id);
      
      setData(prev => ({
        ...prev,
        career: prev.career.filter(item => item.id !== id)
      }));
      
      if (editingItemId === id) {
        setEditingItemId(null);
      }
      
      toast({
        title: "Item Deleted",
        description: "Career item has been deleted.",
      });
    } catch (error) {
      console.error("Error deleting career item:", error);
      toast({
        title: "Failed to Delete",
        description: "Could not delete career item. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const handleAddSkillItem = () => {
    const newItem: SkillItem = {
      name: 'New Skill',
      category: 'other',
      logoSvg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>',
    };
    
    setData(prev => ({
      ...prev,
      skills: [...prev.skills, newItem]
    }));
    
    setEditingItemId("new");
  };
  
  const handleSkillItemChange = (id: string | undefined, field: string, value: any) => {
    setData(prev => ({
      ...prev,
      skills: prev.skills.map(item => 
        item.id === id ? { ...item, [field]: value } : item
      )
    }));
  };
  
  const handleDeleteSkillItem = async (id: string | undefined) => {
    if (!id) {
      setData(prev => ({
        ...prev,
        skills: prev.skills.filter(item => item.id !== id)
      }));
      return;
    }
    
    try {
      await SkillService.delete(id);
      
      setData(prev => ({
        ...prev,
        skills: prev.skills.filter(item => item.id !== id)
      }));
      
      if (editingItemId === id) {
        setEditingItemId(null);
      }
      
      toast({
        title: "Skill Deleted",
        description: "Skill has been deleted.",
      });
    } catch (error) {
      console.error("Error deleting skill:", error);
      toast({
        title: "Failed to Delete",
        description: "Could not delete skill. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>, itemId: string) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setSelectedImage(file);
      setUploadingIndex(itemId);
      
      // For demo purposes, we'll use a mock upload service
      // In a real app, you'd upload to a proper file server or cloud storage
      mockFileUpload(file, itemId);
    }
  };

  const mockFileUpload = (file: File, itemId: string) => {
    // Create a mock loading state
    toast({
      title: "Uploading image...",
      description: `Uploading ${file.name}`,
    });

    // Simulate upload time
    setTimeout(() => {
      // Create an object URL to simulate a successful upload
      const imageUrl = URL.createObjectURL(file);
      
      // Update the portfolio item with the new image URL
      setData(prev => ({
        ...prev,
        portfolio: prev.portfolio.map(item => 
          item.id === itemId ? { ...item, image: imageUrl } : item
        )
      }));

      setUploadingIndex(null);
      
      toast({
        title: "Upload complete",
        description: "Image uploaded successfully",
      });
    }, 1500);
  };
  
  const renderAirtableSchemaVisual = () => {
    return (
      <div className="bg-card shadow rounded-lg p-6 border border-border mb-6">
        <h2 className="text-xl font-bold mb-4">Airtable Schema Guide</h2>
        <p className="mb-4">To use this application, set up your Airtable base with the following structure:</p>
        
        <div className="space-y-4">
          <Tabs defaultValue="hero" className="w-full">
            <TabsList className="grid grid-cols-5 mb-4">
              <TabsTrigger value="hero">Hero</TabsTrigger>
              <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
              <TabsTrigger value="career">Career</TabsTrigger>
              <TabsTrigger value="contact">Contact</TabsTrigger>
              <TabsTrigger value="skills">Skills</TabsTrigger>
            </TabsList>
            
            <TabsContent value="hero" className="p-4 border rounded-md">
              <div className="flex items-center mb-3">
                <Table2 className="h-5 w-5 mr-2 text-aqua" />
                <h3 className="font-bold">Hero Table (Single Record)</h3>
              </div>
              <div className="space-y-2 pl-7">
                <div className="flex items-center text-sm">
                  <Grid3X3 className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="font-medium">title</span>
                  <span className="ml-2 text-muted-foreground">Single line text</span>
                </div>
                <div className="flex items-center text-sm">
                  <Grid3X3 className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="font-medium">subtitle</span>
                  <span className="ml-2 text-muted-foreground">Long text</span>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="portfolio" className="p-4 border rounded-md">
              <div className="flex items-center mb-3">
                <Table2 className="h-5 w-5 mr-2 text-aqua" />
                <h3 className="font-bold">Portfolio Table (Multiple Records)</h3>
              </div>
              <div className="space-y-2 pl-7">
                <div className="flex items-center text-sm">
                  <Grid3X3 className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="font-medium">title</span>
                  <span className="ml-2 text-muted-foreground">Single line text</span>
                </div>
                <div className="flex items-center text-sm">
                  <Grid3X3 className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="font-medium">description</span>
                  <span className="ml-2 text-muted-foreground">Long text</span>
                </div>
                <div className="flex items-center text-sm">
                  <Grid3X3 className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="font-medium">image</span>
                  <span className="ml-2 text-muted-foreground">URL</span>
                </div>
                <div className="flex items-center text-sm">
                  <Grid3X3 className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="font-medium">tags</span>
                  <span className="ml-2 text-muted-foreground">Long text - comma separated values</span>
                </div>
                <div className="flex items-center text-sm">
                  <Grid3X3 className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="font-medium">link</span>
                  <span className="ml-2 text-muted-foreground">URL (optional)</span>
                </div>
                <div className="flex items-center text-sm">
                  <Grid3X3 className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="font-medium">github</span>
                  <span className="ml-2 text-muted-foreground">URL (optional)</span>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="career" className="p-4 border rounded-md">
              <div className="flex items-center mb-3">
                <Table2 className="h-5 w-5 mr-2 text-aqua" />
                <h3 className="font-bold">Career Table (Multiple Records)</h3>
              </div>
              <div className="space-y-2 pl-7">
                <div className="flex items-center text-sm">
                  <Grid3X3 className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="font-medium">title</span>
                  <span className="ml-2 text-muted-foreground">Single line text</span>
                </div>
                <div className="flex items-center text-sm">
                  <Grid3X3 className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="font-medium">company</span>
                  <span className="ml-2 text-muted-foreground">Single line text</span>
                </div>
                <div className="flex items-center text-sm">
                  <Grid3X3 className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="font-medium">location</span>
                  <span className="ml-2 text-muted-foreground">Single line text</span>
                </div>
                <div className="flex items-center text-sm">
                  <Grid3X3 className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="font-medium">period</span>
                  <span className="ml-2 text-muted-foreground">Single line text</span>
                </div>
                <div className="flex items-center text-sm">
                  <Grid3X3 className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="font-medium">description</span>
                  <span className="ml-2 text-muted-foreground">Long text</span>
                </div>
                <div className="flex items-center text-sm">
                  <Grid3X3 className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="font-medium">type</span>
                  <span className="ml-2 text-muted-foreground">Single select: work, education, achievement</span>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="contact" className="p-4 border rounded-md">
              <div className="flex items-center mb-3">
                <Table2 className="h-5 w-5 mr-2 text-aqua" />
                <h3 className="font-bold">Contact Table (Single Record)</h3>
              </div>
              <div className="space-y-2 pl-7">
                <div className="flex items-center text-sm">
                  <Grid3X3 className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="font-medium">email</span>
                  <span className="ml-2 text-muted-foreground">Email</span>
                </div>
                <div className="flex items-center text-sm">
                  <Grid3X3 className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="font-medium">phone</span>
                  <span className="ml-2 text-muted-foreground">Phone</span>
                </div>
                <div className="flex items-center text-sm">
                  <Grid3X3 className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="font-medium">location</span>
                  <span className="ml-2 text-muted-foreground">Single line text</span>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="skills" className="p-4 border rounded-md">
              <div className="flex items-center mb-3">
                <Table2 className="h-5 w-5 mr-2 text-aqua" />
                <h3 className="font-bold">Skills Table (Multiple Records)</h3>
              </div>
              <div className="space-y-2 pl-7">
                <div className="flex items-center text-sm">
                  <Grid3X3 className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="font-medium">name</span>
                  <span className="ml-2 text-muted-foreground">Single line text</span>
                </div>
                <div className="flex items-center text-sm">
                  <Grid3X3 className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="font-medium">category</span>
                  <span className="ml-2 text-muted-foreground">Single select: web, api, software, network, data, other</span>
                </div>
                <div className="flex items-center text-sm">
                  <Grid3X3 className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="font-medium">logoSvg</span>
                  <span className="ml-2 text-muted-foreground">Long text - contains SVG code</span>
                </div>
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="bg-muted/50 p-4 rounded-md mt-4">
            <h3 className="font-bold mb-2 flex items-center">
              <FileSpreadsheet className="h-5 w-5 mr-2 text-aqua" />
              Setup Instructions:
            </h3>
            <ol className="list-decimal pl-5 space-y-1 text-sm">
              <li>Create a new Airtable base named "Portfolio Website"</li>
              <li>Create the tables and fields listed above</li>
              <li>Add at least one record to each table</li>
              <li>Create a Personal Access Token in Airtable (<a href="https://airtable.com/create/tokens" target="_blank" rel="noopener noreferrer" className="text-aqua hover:underline">https://airtable.com/create/tokens</a>)</li>
              <li>Set the correct permissions (data.records:read, data.records:write)</li>
              <li>Find your base ID in the API documentation (it starts with "app")</li>
              <li>Enter your API key and base ID in the application settings</li>
            </ol>
          </div>
        </div>
      </div>
    );
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
                  Changes saved!
                </motion.span>
              )}
              {isConnected && (
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="px-4 py-2 bg-aqua text-white rounded-md flex items-center transition-colors hover:bg-aqua/90 disabled:opacity-70"
                >
                  {isSaving ? (
                    <span className="flex items-center">
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </span>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </button>
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
            <div>
              {renderAirtableSchemaVisual()}
              
              <div className="bg-card shadow rounded-lg p-6 border border-border">
                <h2 className="text-xl font-bold mb-6">Welcome to your Portfolio Admin</h2>
                <p className="mb-6">Here you can edit all of your portfolio content. Use the navigation to access different sections.</p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-muted/40 p-4 rounded-lg flex flex-col items-center text-center">
                    <Briefcase className="h-8 w-8 mb-2 text-aqua" />
                    <h3 className="font-bold mb-1">Portfolio</h3>
                    <p className="text-sm text-muted-foreground">Showcase your projects and work</p>
                  </div>
                  
                  <div className="bg-muted/40 p-4 rounded-lg flex flex-col items-center text-center">
                    <User className="h-8 w-8 mb-2 text-aqua" />
                    <h3 className="font-bold mb-1">Career</h3>
                    <p className="text-sm text-muted-foreground">Document your professional experience</p>
                  </div>
                  
                  <div className="bg-muted/40 p-4 rounded-lg flex flex-col items-center text-center">
                    <Wrench className="h-8 w-8 mb-2 text-aqua" />
                    <h3 className="font-bold mb-1">Skills</h3>
                    <p className="text-sm text-muted-foreground">Highlight your technical expertise</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'portfolio' && (
            <div>
              <div className="bg-card shadow rounded-lg p-6 border border-border mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">Hero Section</h2>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Title</label>
                    <Input
                      value={data.hero.title}
                      onChange={(e) => handleChange('hero', 'title', e.target.value)}
                      placeholder="Your hero title"
                      className="w-full"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Subtitle</label>
                    <Input
                      value={data.hero.subtitle}
                      onChange={(e) => handleChange('hero', 'subtitle', e.target.value)}
                      placeholder="Your hero subtitle"
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
              
              <div className="bg-card shadow rounded-lg p-6 border border-border">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">Portfolio Items</h2>
                  <button
                    onClick={handleAddPortfolioItem}
                    className="px-3 py-1 bg-aqua text-white rounded-md text-sm flex items-center"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Add Item
                  </button>
                </div>
                
                <div className="space-y-6">
                  {data.portfolio.map((item, index) => (
                    <div 
                      key={item.id || index} 
                      className="border rounded-md p-4 relative"
                    >
                      <div className="absolute top-4 right-4 flex space-x-2">
                        <button
                          onClick={() => setEditingItemId(editingItemId === item.id ? null : item.id)}
                          className="p-1 bg-muted rounded-md hover:bg-muted/80"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeletePortfolioItem(item.id)}
                          className="p-1 bg-red-100 text-red-600 rounded-md hover:bg-red-200"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      
                      {editingItemId === item.id ? (
                        <div className="space-y-3">
                          <div>
                            <label className="block text-sm font-medium mb-1">Title</label>
                            <Input
                              value={item.title || ''}
                              onChange={(e) => handlePortfolioItemChange(item.id, 'title', e.target.value)}
                              placeholder="Project title"
                              className="w-full"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium mb-1">Description</label>
                            <Input
                              value={item.description || ''}
                              onChange={(e) => handlePortfolioItemChange(item.id, 'description', e.target.value)}
                              placeholder="Project description"
                              className="w-full"
                            />
                          </div>
                          
                          <div>
                            <Label className="block text-sm font-medium mb-1">Project Image</Label>
                            <div className="mt-1 flex items-start">
                              {item.image && (
                                <div className="relative h-24 w-24 rounded overflow-hidden mr-4 mb-2">
                                  <img 
                                    src={item.image} 
                                    alt={item.title} 
                                    className="h-full w-full object-cover"
                                  />
                                </div>
                              )}
                              
                              <div className="flex-1">
                                <div className="flex items-center">
                                  <Label
                                    htmlFor={`image-upload-${item.id || index}`}
                                    className="cursor-pointer px-4 py-2 bg-muted hover:bg-muted/80 rounded-md inline-flex items-center text-sm font-medium transition-colors"
                                  >
                                    {uploadingIndex === item.id ? (
                                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    ) : (
                                      <Upload className="h-4 w-4 mr-2" />
                                    )}
                                    {uploadingIndex === item.id ? "Uploading..." : "Upload Image"}
                                  </Label>
                                  <Input
                                    id={`image-upload-${item.id || index}`}
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => handleImageUpload(e, item.id || "new")}
                                  />
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">Upload a JPG, PNG or WebP image</p>
                                
                                <div className="mt-2">
                                  <Label htmlFor={`image-url-${item.id || index}`} className="text-xs font-medium">
                                    Or enter image URL directly:
                                  </Label>
                                  <Input
                                    id={`image-url-${item.id || index}`}
                                    value={item.image || ''}
                                    onChange={(e) => handlePortfolioItemChange(item.id, 'image', e.target.value)}
                                    placeholder="https://example.com/image.jpg"
                                    className="w-full mt-1"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium mb-1">Tags (comma separated)</label>
                            <Input
                              value={Array.isArray(item.tags) ? item.tags.join(', ') : ''}
                              onChange={(e) => handlePortfolioItemChange(
                                item.id, 
                                'tags', 
                                e.target.value.split(',').map(tag => tag.trim())
                              )}
                              placeholder="React, TypeScript, UI/UX"
                              className="w-full"
                            />
                          </div>
                          
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-sm font-medium mb-1">Live Link (optional)</label>
                              <Input
                                value={item.link || ''}
                                onChange={(e) => handlePortfolioItemChange(item.id, 'link', e.target.value)}
                                placeholder="https://example.com"
                                className="w-full"
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium mb-1">GitHub Link (optional)</label>
                              <Input
                                value={item.github || ''}
                                onChange={(e) => handlePortfolioItemChange(item.id, 'github', e.target.value)}
                                placeholder="https://github.com/username/repo"
                                className="w-full"
                              />
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div className="flex items-start">
                            <div className="w-16 h-16 rounded overflow-hidden mr-4 bg-muted flex-shrink-0">
                              {item.image ? (
                                <img 
                                  src={item.image} 
                                  alt={item.title} 
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <Image className="h-6 w-6 text-muted-foreground" />
                                </div>
                              )}
                            </div>
                            <div>
                              <h3 className="font-bold">{item.title}</h3>
                              <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
                              <div className="flex flex-wrap gap-1 mt-2">
                                {Array.isArray(item.tags) && item.tags.map((tag, tagIndex) => (
                                  <span 
                                    key={tagIndex} 
                                    className="px-2 py-0.5 bg-muted text-xs rounded-full"
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'career' && (
            <div>
              <div className="bg-card shadow rounded-lg p-6 border border-border">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">Career Timeline</h2>
                  <button
                    onClick={handleAddCareerItem}
                    className="px-3 py-1 bg-aqua text-white rounded-md text-sm flex items-center"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Add Item
                  </button>
                </div>
                
                <div className="space-y-6">
                  {data.career.map((item, index) => (
                    <div 
                      key={item.id || index} 
                      className="border rounded-md p-4 relative"
                    >
                      <div className="absolute top-4 right-4 flex space-x-2">
                        <button
                          onClick={() => setEditingItemId(editingItemId === item.id ? null : item.id)}
                          className="p-1 bg-muted rounded-md hover:bg-muted/80"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteCareerItem(item.id)}
                          className="p-1 bg-red-100 text-red-600 rounded-md hover:bg-red-200"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      
                      {editingItemId === item.id ? (
                        <div className="space-y-3">
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-sm font-medium mb-1">Title</label>
                              <Input
                                value={item.title || ''}
                                onChange={(e) => handleCareerItemChange(item.id, 'title', e.target.value)}
                                placeholder="Position title"
                                className="w-full"
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium mb-1">Company/Institution</label>
                              <Input
                                value={item.company || ''}
                                onChange={(e) => handleCareerItemChange(item.id, 'company', e.target.value)}
                                placeholder="Company name"
                                className="w-full"
                              />
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-sm font-medium mb-1">Location</label>
                              <Input
                                value={item.location || ''}
                                onChange={(e) => handleCareerItemChange(item.id, 'location', e.target.value)}
                                placeholder="City, Country"
                                className="w-full"
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium mb-1">Period</label>
                              <Input
                                value={item.period || ''}
                                onChange={(e) => handleCareerItemChange(item.id, 'period', e.target.value)}
                                placeholder="2020 - Present"
                                className="w-full"
                              />
                            </div>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium mb-1">Description</label>
                            <Input
                              value={item.description || ''}
                              onChange={(e) => handleCareerItemChange(item.id, 'description', e.target.value)}
                              placeholder="Brief description of role or achievement"
                              className="w-full"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium mb-1">Type</label>
                            <select
                              value={item.type || 'work'}
                              onChange={(e) => handleCareerItemChange(item.id, 'type', e.target.value)}
                              className="w-full p-2 border rounded-md"
                            >
                              <option value="work">Work Experience</option>
                              <option value="education">Education</option>
                              <option value="achievement">Achievement/Award</option>
                            </select>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div className="flex justify-between mb-1">
                            <h3 className="font-bold">{item.title}</h3>
                            <span className="text-sm text-muted-foreground">{item.period}</span>
                          </div>
                          <div className="flex items-center text-sm text-muted-foreground mb-2">
                            <span>{item.company}</span>
                            <span className="mx-2">•</span>
                            <span>{item.location}</span>
                          </div>
                          <p className="text-sm">{item.description}</p>
                          <div className="mt-2">
                            <span 
                              className={`px-2 py-0.5 text-xs rounded-full ${
                                item.type === 'work' 
                                  ? 'bg-blue-100 text-blue-800' 
                                  : item.type === 'education'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-purple-100 text-purple-800'
                              }`}
                            >
                              {item.type === 'work' 
                                ? 'Work' 
                                : item.type === 'education' 
                                  ? 'Education' 
                                  : 'Achievement'}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'contact' && (
            <div>
              <div className="bg-card shadow rounded-lg p-6 border border-border">
                <h2 className="text-xl font-bold mb-6">Contact Information</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Email Address</label>
                    <Input
                      value={data.contact.email}
                      onChange={(e) => handleChange('contact', 'email', e.target.value)}
                      placeholder="your.email@example.com"
                      type="email"
                      className="w-full"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Phone Number</label>
                    <Input
                      value={data.contact.phone}
                      onChange={(e) => handleChange('contact', 'phone', e.target.value)}
                      placeholder="+1 (234) 567-890"
                      className="w-full"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Location</label>
                    <Input
                      value={data.contact.location}
                      onChange={(e) => handleChange('contact', 'location', e.target.value)}
                      placeholder="City, Country"
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'skills' && (
            <div>
              <div className="bg-card shadow rounded-lg p-6 border border-border">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">Skills & Technologies</h2>
                  <button
                    onClick={handleAddSkillItem}
                    className="px-3 py-1 bg-aqua text-white rounded-md text-sm flex items-center"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Add Skill
                  </button>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {data.skills.map((item, index) => (
                    <div 
                      key={item.id || index} 
                      className="border rounded-md p-4 relative"
                    >
                      <div className="absolute top-4 right-4 flex space-x-2">
                        <button
                          onClick={() => setEditingItemId(editingItemId === item.id ? null : item.id)}
                          className="p-1 bg-muted rounded-md hover:bg-muted/80"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteSkillItem(item.id)}
                          className="p-1 bg-red-100 text-red-600 rounded-md hover:bg-red-200"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      
                      {editingItemId === item.id ? (
                        <div className="space-y-3 pt-6">
                          <div>
                            <label className="block text-sm font-medium mb-1">Skill Name</label>
                            <Input
                              value={item.name || ''}
                              onChange={(e) => handleSkillItemChange(item.id, 'name', e.target.value)}
                              placeholder="JavaScript"
                              className="w-full"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium mb-1">Category</label>
                            <select
                              value={item.category || 'other'}
                              onChange={(e) => handleSkillItemChange(item.id, 'category', e.target.value)}
                              className="w-full p-2 border rounded-md"
                            >
                              <option value="web">Web Development</option>
                              <option value="api">API & Backend</option>
                              <option value="software">Software Engineering</option>
                              <option value="network">Networking</option>
                              <option value="data">Data & Analytics</option>
                              <option value="other">Other</option>
                            </select>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium mb-1">Logo SVG</label>
                            <Input
                              value={item.logoSvg || ''}
                              onChange={(e) => handleSkillItemChange(item.id, 'logoSvg', e.target.value)}
                              placeholder="<svg>...</svg>"
                              className="w-full"
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center pt-6">
                          <div 
                            className="w-12 h-12 flex items-center justify-center"
                            dangerouslySetInnerHTML={{ __html: item.logoSvg || '' }}
                          />
                          <h3 className="font-medium mt-2">{item.name}</h3>
                          <span className="text-xs text-muted-foreground capitalize mt-1">
                            {item.category || 'other'}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'settings' && (
            <div>
              <div className="bg-card shadow rounded-lg p-6 border border-border mb-6">
                <h2 className="text-xl font-bold mb-4">Airtable Connection</h2>
                <p className="mb-6">Connect your portfolio to Airtable to store and manage your content.</p>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Airtable API Key</label>
                    <Input
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      placeholder="patXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
                      type="password"
                      className="w-full"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Create a <a href="https://airtable.com/create/tokens" target="_blank" rel="noopener noreferrer" className="text-aqua hover:underline">Personal Access Token</a> with scopes: data.records:read, data.records:write
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Airtable Base ID</label>
                    <Input
                      value={baseId}
                      onChange={(e) => setBaseId(e.target.value)}
                      placeholder="appXXXXXXXXXXXX"
                      className="w-full"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Find this in your Airtable API documentation. It starts with "app".
                    </p>
                  </div>
                  
                  <Button
                    onClick={connectToAirtable}
                    disabled={isConfiguring || !apiKey || !baseId}
                    className="px-4 py-2 bg-aqua text-white rounded-md flex items-center transition-colors hover:bg-aqua/90 disabled:opacity-70"
                  >
                    {isConfiguring ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Connecting...
                      </>
                    ) : isConnected ? (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Update Connection
                      </>
                    ) : (
                      <>
                        <Database className="h-4 w-4 mr-2" />
                        Connect to Airtable
                      </>
                    )}
                  </Button>
                </div>
              </div>
              
              {renderAirtableSchemaVisual()}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default BackOffice;
