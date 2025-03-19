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
  CheckCircle
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

const BackOffice = () => {
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
            <div className="bg-card shadow rounded-lg p-6 border border-border">
              <h2 className="text-xl font-bold mb-6">Welcome to your Portfolio Admin</h2>
              <p className="mb-6">Here you can edit all of your portfolio content. Use the navigation to access different sections.</p>
              
              {isConnected ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-muted p-6 rounded-lg">
                    <Briefcase className="h-8 w-8 text-aqua mb-2" />
                    <h3 className="font-bold text-lg mb-1">Portfolio</h3>
                    <p className="text-sm text-muted-foreground">{data.portfolio.length} projects</p>
                  </div>
                  
                  <div className="bg-muted p-6 rounded-lg">
                    <User className="h-8 w-8 text-aqua mb-2" />
                    <h3 className="font-bold text-lg mb-1">Career</h3>
                    <p className="text-sm text-muted-foreground">{data.career.length} entries</p>
                  </div>
                  
                  <div className="bg-muted p-6 rounded-lg">
                    <Wrench className="h-8 w-8 text-aqua mb-2" />
                    <h3 className="font-bold text-lg mb-1">Skills</h3>
                    <p className="text-sm text-muted-foreground">{data.skills.length} skills</p>
                  </div>
                </div>
              ) : (
                <div className="bg-muted p-6 rounded-lg">
                  <Database className="h-8 w-8 text-aqua mb-2" />
                  <h3 className="font-bold text-lg mb-1">Airtable Connection</h3>
                  <p className="text-sm text-muted-foreground mb-4">Connect to Airtable to manage your content</p>
                  <button
                    onClick={() => setActiveTab('settings')}
                    className="px-4 py-2 bg-aqua text-white rounded-md text-sm"
                  >
                    Configure Connection
                  </button>
                </div>
              )}
              
              <p className="mt-6 text-sm text-muted-foreground">
                Last login: {new Date().toLocaleString()}
              </p>
            </div>
          )}
          
          {activeTab === 'portfolio' && isConnected && (
            <div>
              <div className="bg-card shadow rounded-lg p-6 border border-border mb-6">
                <h2 className="text-xl font-bold mb-4">Hero Section</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Title</label>
                    <Input
                      type="text"
                      value={data.hero.title}
                      onChange={(e) => handleChange('hero', 'title', e.target.value)}
                      className="w-full"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Subtitle</label>
                    <textarea
                      value={data.hero.subtitle}
                      onChange={(e) => handleChange('hero', 'subtitle', e.target.value)}
                      rows={3}
                      className="w-full px-4 py-2 border border-border rounded-md"
                    />
                  </div>
                </div>
              </div>
              
              <div className="bg-card shadow rounded-lg p-6 border border-border">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold">Portfolio Projects</h2>
                  <button
                    onClick={handleAddPortfolioItem}
                    className="px-3 py-1 bg-aqua text-white rounded-md text-sm"
                  >
                    Add Project
                  </button>
                </div>
                
                <div className="space-y-6">
                  {data.portfolio.map((item) => (
                    <div key={item.id || Math.random()} className="border border-border rounded-lg overflow-hidden">
                      <div className="p-4 bg-muted flex justify-between items-center">
                        <h3 className="font-medium">{item.title}</h3>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => setEditingItemId(editingItemId === item.id ? null : item.id)}
                            className="p-1 hover:text-aqua"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => handleDeletePortfolioItem(item.id)}
                            className="p-1 hover:text-destructive"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                      
                      {editingItemId === item.id && (
                        <div className="p-4 space-y-4">
                          <div>
                            <label className="block text-sm font-medium mb-1">Title</label>
                            <Input
                              type="text"
                              value={item.title}
                              onChange={(e) => handlePortfolioItemChange(item.id, 'title', e.target.value)}
                              className="w-full"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium mb-1">Description</label>
                            <textarea
                              value={item.description}
                              onChange={(e) => handlePortfolioItemChange(item.id, 'description', e.target.value)}
                              rows={3}
                              className="w-full px-4 py-2 border border-border rounded-md"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium mb-1">Image URL</label>
                            <div className="flex">
                              <Input
                                type="text"
                                value={item.image}
                                onChange={(e) => handlePortfolioItemChange(item.id, 'image', e.target.value)}
                                className="flex-1 rounded-r-none"
                              />
                              <button className="bg-muted px-3 border-y border-r border-border rounded-r-md">
                                <Image size={16} />
                              </button>
                            </div>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium mb-1">Tags (comma separated)</label>
                            <Input
                              type="text"
                              value={item.tags.join(', ')}
                              onChange={(e) => handlePortfolioItemChange(
                                item.id, 
                                'tags', 
                                e.target.value.split(',').map(tag => tag.trim())
                              )}
                              className="w-full"
                            />
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium mb-1">Live Link (optional)</label>
                              <Input
                                type="text"
                                value={item.link || ''}
                                onChange={(e) => handlePortfolioItemChange(item.id, 'link', e.target.value)}
                                className="w-full"
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium mb-1">GitHub Link (optional)</label>
                              <Input
                                type="text"
                                value={item.github || ''}
                                onChange={(e) => handlePortfolioItemChange(item.id, 'github', e.target.value)}
                                className="w-full"
                              />
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
          
          {activeTab === 'career' && isConnected && (
            <div className="bg-card shadow rounded-lg p-6 border border-border">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Career Timeline</h2>
                <button
                  onClick={handleAddCareerItem}
                  className="px-3 py-1 bg-aqua text-white rounded-md text-sm"
                >
                  Add Entry
                </button>
              </div>
              
              <div className="space-y-6">
                {data.career.map((item) => (
                  <div key={item.id || Math.random()} className="border border-border rounded-lg overflow-hidden">
                    <div className="p-4 bg-muted flex justify-between items-center">
                      <div>
                        <h3 className="font-medium">{item.title}</h3>
                        <p className="text-sm text-muted-foreground">{item.company}</p>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setEditingItemId(editingItemId === item.id ? null : item.id)}
                          className="p-1 hover:text-aqua"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteCareerItem(item.id)}
                          className="p-1 hover:text-destructive"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                    
                    {editingItemId === item.id && (
                      <div className="p-4 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-1">Title</label>
                            <Input
                              type="text"
                              value={item.title}
                              onChange={(e) => handleCareerItemChange(item.id, 'title', e.target.value)}
                              className="w-full"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium mb-1">Company/Institution</label>
                            <Input
                              type="text"
                              value={item.company}
                              onChange={(e) => handleCareerItemChange(item.id, 'company', e.target.value)}
                              className="w-full"
                            />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-1">Location</label>
                            <Input
                              type="text"
                              value={item.location}
                              onChange={(e) => handleCareerItemChange(item.id, 'location', e.target.value)}
                              className="w-full"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium mb-1">Period</label>
                            <Input
                              type="text"
                              value={item.period}
                              onChange={(e) => handleCareerItemChange(item.id, 'period', e.target.value)}
                              className="w-full"
                            />
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium mb-1">Description</label>
                          <textarea
                            value={item.description}
                            onChange={(e) => handleCareerItemChange(item.id, 'description', e.target.value)}
                            rows={3}
                            className="w-full px-4 py-2 border border-border rounded-md"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium mb-1">Type</label>
                          <select
                            value={item.type}
                            onChange={(e) => handleCareerItemChange(item.id, 'type', e.target.value as 'work' | 'education' | 'achievement')}
                            className="w-full px-4 py-2 border border-border rounded-md"
                          >
                            <option value="work">Work</option>
                            <option value="education">Education</option>
                            <option value="achievement">Achievement</option>
                          </select>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {activeTab === 'skills' && isConnected && (
            <div className="bg-card shadow rounded-lg p-6 border border-border">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Skills & Technologies</h2>
                <button
                  onClick={handleAddSkillItem}
                  className="px-3 py-1 bg-aqua text-white rounded-md text-sm"
                >
                  Add Skill
                </button>
              </div>
              
              <div className="space-y-6">
                {data.skills.map((item) => (
                  <div key={item.id || Math.random()} className="border border-border rounded-lg overflow-hidden">
                    <div className="p-4 bg-muted flex justify-between items-center">
                      <div className="flex items-center">
                        <div 
                          className="w-8 h-8 mr-3 flex items-center justify-center"
                          dangerouslySetInnerHTML={{ __html: item.logoSvg || '' }}
                        />
                        <h3 className="font-medium">{item.name}</h3>
                        <span className="ml-2 px-2 py-0.5 bg-background text-xs rounded-full">
                          {item.category}
                        </span>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setEditingItemId(editingItemId === item.id ? null : item.id)}
                          className="p-1 hover:text-aqua"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteSkillItem(item.id)}
                          className="p-1 hover:text-destructive"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                    
                    {editingItemId === item.id && (
                      <div className="p-4 space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">Name</label>
                          <Input
                            type="text"
                            value={item.name}
                            onChange={(e) => handleSkillItemChange(item.id, 'name', e.target.value)}
                            className="w-full"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium mb-1">Category</label>
                          <select
                            value={item.category}
                            onChange={(e) => handleSkillItemChange(item.id, 'category', e.target.value)}
                            className="w-full px-4 py-2 border border-border rounded-md"
                          >
                            <option value="web">Web</option>
                            <option value="api">API</option>
                            <option value="software">Software</option>
                            <option value="network">Network</option>
                            <option value="data">Data</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium mb-1">SVG Logo</label>
                          <textarea
                            value={item.logoSvg || ''}
                            onChange={(e) => handleSkillItemChange(item.id, 'logoSvg', e.target.value)}
                            rows={4}
                            className="w-full px-4 py-2 border border-border rounded-md font-mono text-sm"
                            placeholder='<svg>...</svg>'
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium mb-1">Preview</label>
                          <div className="border border-border rounded-md p-4 flex items-center justify-center">
                            <div 
                              className="w-16 h-16 text-primary"
                              dangerouslySetInnerHTML={{ __html: item.logoSvg || '<svg></svg>' }}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {activeTab === 'contact' && isConnected && (
            <div className="bg-card shadow rounded-lg p-6 border border-border">
              <h2 className="text-xl font-bold mb-6">Contact Information</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <Input
                    type="email"
                    value={data.contact.email}
                    onChange={(e) => handleChange('contact', 'email', e.target.value)}
                    className="w-full"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Phone</label>
                  <Input
                    type="text"
                    value={data.contact.phone}
                    onChange={(e) => handleChange('contact', 'phone', e.target.value)}
                    className="w-full"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Location</label>
                  <Input
                    type="text"
                    value={data.contact.location}
                    onChange={(e) => handleChange('contact', 'location', e.target.value)}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div className="bg-card shadow rounded-lg p-6 border border-border">
                <h2 className="text-xl font-bold mb-6">Airtable Connection</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Airtable API Key</label>
                    <Input
                      type="password"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      className="w-full"
                      placeholder="pat..."
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Your API key is stored locally and never shared.
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Airtable Base ID</label>
                    <Input
                      type="text"
                      value={baseId}
                      onChange={(e) => setBaseId(e.target.value)}
                      className="w-full"
                      placeholder="app..."
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Find your Base ID in the Airtable API documentation.
                    </p>
                  </div>
                  
                  <button
                    onClick={connectToAirtable}
                    disabled={isConfiguring || !apiKey || !baseId}
                    className="px-4 py-2 bg-aqua text-white rounded-md flex items-center transition-colors hover:bg-aqua/90 disabled:opacity-70"
                  >
                    {isConfiguring ? (
                      <span className="flex items-center">
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Connecting...
                      </span>
                    ) : isConnected ? (
                      <span className="flex items-center">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Connected
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <Database className="h-4 w-4 mr-2" />
                        Connect to Airtable
                      </span>
                    )}
                  </button>
                </div>
              </div>
              
              <div className="bg-card shadow rounded-lg p-6 border border-border">
                <h2 className="text-xl font-bold mb-6">Account Settings</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <Input
                      type="email"
                      value={user?.email}
                      disabled
                      className="w-full bg-muted"
                    />
                    <p className="text-xs text-muted-foreground mt-1">To change your email, please contact support.</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Password</label>
                    <button
                      className="px-4 py-2 border border-border rounded-md hover:bg-muted"
                    >
                      Change Password
                    </button>
                  </div>
                  
                  <div className="pt-4 border-t border-border">
                    <h3 className="text-lg font-medium mb-4">Danger Zone</h3>
                    <button
                      className="px-4 py-2 border border-destructive text-destructive rounded-md hover:bg-destructive/10"
                    >
                      Delete Account
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default BackOffice;
