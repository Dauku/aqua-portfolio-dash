
interface AirtableRecord {
  id: string;
  fields: any;
  createdTime: string;
}

// Base class for Airtable API interactions
class AirtableService {
  private apiKey: string;
  private baseId: string;
  
  constructor() {
    // In a production app, this would be stored in environment variables
    // For now, we'll store it in localStorage to keep it somewhat protected
    this.apiKey = localStorage.getItem('airtable_api_key') || '';
    this.baseId = localStorage.getItem('airtable_base_id') || '';
  }
  
  setApiKey(key: string) {
    this.apiKey = key;
    localStorage.setItem('airtable_api_key', key);
  }
  
  setBaseId(id: string) {
    this.baseId = id;
    localStorage.setItem('airtable_base_id', id);
  }
  
  getApiKey() {
    return this.apiKey;
  }
  
  getBaseId() {
    return this.baseId;
  }
  
  async fetchRecords(tableName: string): Promise<AirtableRecord[]> {
    if (!this.apiKey) {
      throw new Error('API key not set');
    }
    
    const response = await fetch(
      `https://api.airtable.com/v0/${this.baseId}/${encodeURIComponent(tableName)}`,
      {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
        },
      }
    );
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Airtable API error: ${errorData.error?.message || response.statusText}`);
    }
    
    const data = await response.json();
    return data.records;
  }
  
  async createRecord(tableName: string, fields: any): Promise<AirtableRecord> {
    if (!this.apiKey) {
      throw new Error('API key not set');
    }
    
    const response = await fetch(
      `https://api.airtable.com/v0/${this.baseId}/${encodeURIComponent(tableName)}`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fields }),
      }
    );
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Airtable API error: ${errorData.error?.message || response.statusText}`);
    }
    
    return response.json();
  }
  
  async updateRecord(tableName: string, recordId: string, fields: any): Promise<AirtableRecord> {
    if (!this.apiKey) {
      throw new Error('API key not set');
    }
    
    const response = await fetch(
      `https://api.airtable.com/v0/${this.baseId}/${encodeURIComponent(tableName)}/${recordId}`,
      {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fields }),
      }
    );
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Airtable API error: ${errorData.error?.message || response.statusText}`);
    }
    
    return response.json();
  }
  
  async deleteRecord(tableName: string, recordId: string): Promise<{ deleted: boolean; id: string }> {
    if (!this.apiKey) {
      throw new Error('API key not set');
    }
    
    const response = await fetch(
      `https://api.airtable.com/v0/${this.baseId}/${encodeURIComponent(tableName)}/${recordId}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
        },
      }
    );
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Airtable API error: ${errorData.error?.message || response.statusText}`);
    }
    
    return response.json();
  }

  // Function to upload an image to a publicly accessible URL
  // In a real app, this would use a proper service like S3, Cloudinary, etc.
  async uploadImage(file: File): Promise<string> {
    // This is a mock function - in production, replace with actual upload logic
    return new Promise((resolve) => {
      setTimeout(() => {
        // Create a mock image URL - in production, this would be the URL returned by the upload service
        const imageId = Math.random().toString(36).substring(2, 15);
        const imageUrl = `https://example.com/images/${imageId}-${file.name}`;
        resolve(imageUrl);
      }, 1000);
    });
  }
}

export const airtableService = new AirtableService();

// Type definitions for our data models
export interface HeroData {
  id?: string;
  title: string;
  subtitle: string;
}

export interface PortfolioItem {
  id?: string;
  title: string;
  description: string;
  image: string;
  tags: string[];
  link?: string;
  github?: string;
}

export interface CareerItem {
  id?: string;
  title: string;
  company: string;
  location: string;
  period: string;
  description: string;
  type: 'work' | 'education' | 'achievement';
}

export interface ContactInfo {
  id?: string;
  email: string;
  phone: string;
  location: string;
}

export interface SkillItem {
  id?: string;
  name: string;
  category: 'web' | 'api' | 'software' | 'network' | 'data' | 'other';
  logoSvg?: string;
}

// Service wrapper classes for each data type
export class HeroService {
  private static readonly TABLE_NAME = 'Hero';
  private static readonly CACHE_KEY = 'hero_data';
  
  static async get(): Promise<HeroData | null> {
    try {
      // First check local cache
      const cachedData = localStorage.getItem(this.CACHE_KEY);
      if (cachedData) {
        return JSON.parse(cachedData);
      }
      
      const records = await airtableService.fetchRecords(this.TABLE_NAME);
      if (records.length === 0) return null;
      
      const record = records[0];
      const heroData = {
        id: record.id,
        title: record.fields.title || '',
        subtitle: record.fields.subtitle || '',
      };
      
      // Save to local cache
      localStorage.setItem(this.CACHE_KEY, JSON.stringify(heroData));
      
      return heroData;
    } catch (error) {
      console.error('Error fetching hero data:', error);
      // If API call fails, try to use cached data
      const cachedData = localStorage.getItem(this.CACHE_KEY);
      if (cachedData) {
        return JSON.parse(cachedData);
      }
      return null;
    }
  }
  
  static async save(data: HeroData): Promise<HeroData | null> {
    try {
      let record;
      
      if (data.id) {
        record = await airtableService.updateRecord(this.TABLE_NAME, data.id, {
          title: data.title,
          subtitle: data.subtitle,
        });
      } else {
        record = await airtableService.createRecord(this.TABLE_NAME, {
          title: data.title,
          subtitle: data.subtitle,
        });
      }
      
      const heroData = {
        id: record.id,
        title: record.fields.title,
        subtitle: record.fields.subtitle,
      };
      
      // Update local cache
      localStorage.setItem(this.CACHE_KEY, JSON.stringify(heroData));
      
      return heroData;
    } catch (error) {
      console.error('Error saving hero data:', error);
      return null;
    }
  }
}

export class PortfolioService {
  private static readonly TABLE_NAME = 'Portfolio';
  private static readonly CACHE_KEY = 'portfolio_data';
  
  static async getAll(): Promise<PortfolioItem[]> {
    try {
      // First check local cache
      const cachedData = localStorage.getItem(this.CACHE_KEY);
      if (cachedData) {
        return JSON.parse(cachedData);
      }
      
      const records = await airtableService.fetchRecords(this.TABLE_NAME);
      const portfolioItems = records.map(record => ({
        id: record.id,
        title: record.fields.title || '',
        description: record.fields.description || '',
        image: record.fields.image || '',
        tags: record.fields.tags?.split(',').map((tag: string) => tag.trim()) || [],
        link: record.fields.link || '',
        github: record.fields.github || '',
      }));
      
      // Save to local cache
      localStorage.setItem(this.CACHE_KEY, JSON.stringify(portfolioItems));
      
      return portfolioItems;
    } catch (error) {
      console.error('Error fetching portfolio items:', error);
      // If API call fails, try to use cached data
      const cachedData = localStorage.getItem(this.CACHE_KEY);
      if (cachedData) {
        return JSON.parse(cachedData);
      }
      return [];
    }
  }
  
  static async save(item: PortfolioItem): Promise<PortfolioItem | null> {
    try {
      const fields = {
        title: item.title,
        description: item.description,
        image: item.image,
        tags: Array.isArray(item.tags) ? item.tags.join(', ') : '',
        link: item.link || '',
        github: item.github || '',
      };
      
      let record;
      if (item.id) {
        record = await airtableService.updateRecord(this.TABLE_NAME, item.id, fields);
      } else {
        record = await airtableService.createRecord(this.TABLE_NAME, fields);
      }
      
      const updatedItem = {
        id: record.id,
        title: record.fields.title,
        description: record.fields.description,
        image: record.fields.image,
        tags: record.fields.tags?.split(',').map((tag: string) => tag.trim()) || [],
        link: record.fields.link || '',
        github: record.fields.github || '',
      };
      
      // Update cache
      const cachedData = localStorage.getItem(this.CACHE_KEY);
      if (cachedData) {
        const items = JSON.parse(cachedData);
        const itemIndex = items.findIndex((i: PortfolioItem) => i.id === updatedItem.id);
        if (itemIndex >= 0) {
          items[itemIndex] = updatedItem;
        } else {
          items.push(updatedItem);
        }
        localStorage.setItem(this.CACHE_KEY, JSON.stringify(items));
      } else {
        localStorage.setItem(this.CACHE_KEY, JSON.stringify([updatedItem]));
      }
      
      return updatedItem;
    } catch (error) {
      console.error('Error saving portfolio item:', error);
      return null;
    }
  }
  
  static async delete(id: string): Promise<boolean> {
    try {
      await airtableService.deleteRecord(this.TABLE_NAME, id);
      
      // Update cache
      const cachedData = localStorage.getItem(this.CACHE_KEY);
      if (cachedData) {
        const items = JSON.parse(cachedData).filter((item: PortfolioItem) => item.id !== id);
        localStorage.setItem(this.CACHE_KEY, JSON.stringify(items));
      }
      
      return true;
    } catch (error) {
      console.error('Error deleting portfolio item:', error);
      return false;
    }
  }
}

export class CareerService {
  private static readonly TABLE_NAME = 'Career';
  private static readonly CACHE_KEY = 'career_data';
  
  static async getAll(): Promise<CareerItem[]> {
    try {
      // First check local cache
      const cachedData = localStorage.getItem(this.CACHE_KEY);
      if (cachedData) {
        return JSON.parse(cachedData);
      }
      
      const records = await airtableService.fetchRecords(this.TABLE_NAME);
      const careerItems = records.map(record => ({
        id: record.id,
        title: record.fields.title || '',
        company: record.fields.company || '',
        location: record.fields.location || '',
        period: record.fields.period || '',
        description: record.fields.description || '',
        type: record.fields.type || 'work',
      }));
      
      // Save to local cache
      localStorage.setItem(this.CACHE_KEY, JSON.stringify(careerItems));
      
      return careerItems;
    } catch (error) {
      console.error('Error fetching career items:', error);
      // If API call fails, try to use cached data
      const cachedData = localStorage.getItem(this.CACHE_KEY);
      if (cachedData) {
        return JSON.parse(cachedData);
      }
      return [];
    }
  }
  
  static async save(item: CareerItem): Promise<CareerItem | null> {
    try {
      const fields = {
        title: item.title,
        company: item.company,
        location: item.location,
        period: item.period,
        description: item.description,
        type: item.type,
      };
      
      let record;
      if (item.id) {
        record = await airtableService.updateRecord(this.TABLE_NAME, item.id, fields);
      } else {
        record = await airtableService.createRecord(this.TABLE_NAME, fields);
      }
      
      const updatedItem = {
        id: record.id,
        title: record.fields.title,
        company: record.fields.company,
        location: record.fields.location,
        period: record.fields.period,
        description: record.fields.description,
        type: record.fields.type,
      };
      
      // Update cache
      const cachedData = localStorage.getItem(this.CACHE_KEY);
      if (cachedData) {
        const items = JSON.parse(cachedData);
        const itemIndex = items.findIndex((i: CareerItem) => i.id === updatedItem.id);
        if (itemIndex >= 0) {
          items[itemIndex] = updatedItem;
        } else {
          items.push(updatedItem);
        }
        localStorage.setItem(this.CACHE_KEY, JSON.stringify(items));
      } else {
        localStorage.setItem(this.CACHE_KEY, JSON.stringify([updatedItem]));
      }
      
      return updatedItem;
    } catch (error) {
      console.error('Error saving career item:', error);
      return null;
    }
  }
  
  static async delete(id: string): Promise<boolean> {
    try {
      await airtableService.deleteRecord(this.TABLE_NAME, id);
      
      // Update cache
      const cachedData = localStorage.getItem(this.CACHE_KEY);
      if (cachedData) {
        const items = JSON.parse(cachedData).filter((item: CareerItem) => item.id !== id);
        localStorage.setItem(this.CACHE_KEY, JSON.stringify(items));
      }
      
      return true;
    } catch (error) {
      console.error('Error deleting career item:', error);
      return false;
    }
  }
}

export class ContactService {
  private static readonly TABLE_NAME = 'Contact';
  private static readonly CACHE_KEY = 'contact_data';
  
  static async get(): Promise<ContactInfo | null> {
    try {
      // First check local cache
      const cachedData = localStorage.getItem(this.CACHE_KEY);
      if (cachedData) {
        return JSON.parse(cachedData);
      }
      
      const records = await airtableService.fetchRecords(this.TABLE_NAME);
      if (records.length === 0) return null;
      
      const record = records[0];
      const contactData = {
        id: record.id,
        email: record.fields.email || '',
        phone: record.fields.phone || '',
        location: record.fields.location || '',
      };
      
      // Save to local cache
      localStorage.setItem(this.CACHE_KEY, JSON.stringify(contactData));
      
      return contactData;
    } catch (error) {
      console.error('Error fetching contact info:', error);
      // If API call fails, try to use cached data
      const cachedData = localStorage.getItem(this.CACHE_KEY);
      if (cachedData) {
        return JSON.parse(cachedData);
      }
      return null;
    }
  }
  
  static async save(data: ContactInfo): Promise<ContactInfo | null> {
    try {
      const fields = {
        email: data.email,
        phone: data.phone,
        location: data.location,
      };
      
      let record;
      if (data.id) {
        record = await airtableService.updateRecord(this.TABLE_NAME, data.id, fields);
      } else {
        record = await airtableService.createRecord(this.TABLE_NAME, fields);
      }
      
      const contactData = {
        id: record.id,
        email: record.fields.email,
        phone: record.fields.phone,
        location: record.fields.location,
      };
      
      // Update local cache
      localStorage.setItem(this.CACHE_KEY, JSON.stringify(contactData));
      
      return contactData;
    } catch (error) {
      console.error('Error saving contact info:', error);
      return null;
    }
  }
}

export class SkillService {
  private static readonly TABLE_NAME = 'Skills';
  private static readonly CACHE_KEY = 'skills_data';
  
  static async getAll(): Promise<SkillItem[]> {
    try {
      // First check local cache
      const cachedData = localStorage.getItem(this.CACHE_KEY);
      if (cachedData) {
        return JSON.parse(cachedData);
      }
      
      const records = await airtableService.fetchRecords(this.TABLE_NAME);
      const skillItems = records.map(record => ({
        id: record.id,
        name: record.fields.name || '',
        category: record.fields.category || 'other',
        logoSvg: record.fields.logoSvg || '',
      }));
      
      // Save to local cache
      localStorage.setItem(this.CACHE_KEY, JSON.stringify(skillItems));
      
      return skillItems;
    } catch (error) {
      console.error('Error fetching skills:', error);
      // If API call fails, try to use cached data
      const cachedData = localStorage.getItem(this.CACHE_KEY);
      if (cachedData) {
        return JSON.parse(cachedData);
      }
      return [];
    }
  }
  
  static async save(item: SkillItem): Promise<SkillItem | null> {
    try {
      const fields = {
        name: item.name,
        category: item.category,
        logoSvg: item.logoSvg || '',
      };
      
      let record;
      if (item.id) {
        record = await airtableService.updateRecord(this.TABLE_NAME, item.id, fields);
      } else {
        record = await airtableService.createRecord(this.TABLE_NAME, fields);
      }
      
      const updatedItem = {
        id: record.id,
        name: record.fields.name,
        category: record.fields.category,
        logoSvg: record.fields.logoSvg,
      };
      
      // Update cache
      const cachedData = localStorage.getItem(this.CACHE_KEY);
      if (cachedData) {
        const items = JSON.parse(cachedData);
        const itemIndex = items.findIndex((i: SkillItem) => i.id === updatedItem.id);
        if (itemIndex >= 0) {
          items[itemIndex] = updatedItem;
        } else {
          items.push(updatedItem);
        }
        localStorage.setItem(this.CACHE_KEY, JSON.stringify(items));
      } else {
        localStorage.setItem(this.CACHE_KEY, JSON.stringify([updatedItem]));
      }
      
      return updatedItem;
    } catch (error) {
      console.error('Error saving skill item:', error);
      return null;
    }
  }
  
  static async delete(id: string): Promise<boolean> {
    try {
      await airtableService.deleteRecord(this.TABLE_NAME, id);
      
      // Update cache
      const cachedData = localStorage.getItem(this.CACHE_KEY);
      if (cachedData) {
        const items = JSON.parse(cachedData).filter((item: SkillItem) => item.id !== id);
        localStorage.setItem(this.CACHE_KEY, JSON.stringify(items));
      }
      
      return true;
    } catch (error) {
      console.error('Error deleting skill item:', error);
      return false;
    }
  }
}
