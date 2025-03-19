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
    this.baseId = 'appXXXXXXXXXXXXXX'; // Replace with your actual base ID
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
  
  static async get(): Promise<HeroData | null> {
    try {
      const records = await airtableService.fetchRecords(this.TABLE_NAME);
      if (records.length === 0) return null;
      
      const record = records[0];
      return {
        id: record.id,
        title: record.fields.title || '',
        subtitle: record.fields.subtitle || '',
      };
    } catch (error) {
      console.error('Error fetching hero data:', error);
      return null;
    }
  }
  
  static async save(data: HeroData): Promise<HeroData | null> {
    try {
      if (data.id) {
        const record = await airtableService.updateRecord(this.TABLE_NAME, data.id, {
          title: data.title,
          subtitle: data.subtitle,
        });
        
        return {
          id: record.id,
          title: record.fields.title,
          subtitle: record.fields.subtitle,
        };
      } else {
        const record = await airtableService.createRecord(this.TABLE_NAME, {
          title: data.title,
          subtitle: data.subtitle,
        });
        
        return {
          id: record.id,
          title: record.fields.title,
          subtitle: record.fields.subtitle,
        };
      }
    } catch (error) {
      console.error('Error saving hero data:', error);
      return null;
    }
  }
}

export class PortfolioService {
  private static readonly TABLE_NAME = 'Portfolio';
  
  static async getAll(): Promise<PortfolioItem[]> {
    try {
      const records = await airtableService.fetchRecords(this.TABLE_NAME);
      return records.map(record => ({
        id: record.id,
        title: record.fields.title || '',
        description: record.fields.description || '',
        image: record.fields.image || '',
        tags: record.fields.tags?.split(',').map((tag: string) => tag.trim()) || [],
        link: record.fields.link || '',
        github: record.fields.github || '',
      }));
    } catch (error) {
      console.error('Error fetching portfolio items:', error);
      return [];
    }
  }
  
  static async save(item: PortfolioItem): Promise<PortfolioItem | null> {
    try {
      const fields = {
        title: item.title,
        description: item.description,
        image: item.image,
        tags: item.tags.join(', '),
        link: item.link || '',
        github: item.github || '',
      };
      
      if (item.id) {
        const record = await airtableService.updateRecord(this.TABLE_NAME, item.id, fields);
        return {
          id: record.id,
          title: record.fields.title,
          description: record.fields.description,
          image: record.fields.image,
          tags: record.fields.tags?.split(',').map((tag: string) => tag.trim()) || [],
          link: record.fields.link || '',
          github: record.fields.github || '',
        };
      } else {
        const record = await airtableService.createRecord(this.TABLE_NAME, fields);
        return {
          id: record.id,
          title: record.fields.title,
          description: record.fields.description,
          image: record.fields.image,
          tags: record.fields.tags?.split(',').map((tag: string) => tag.trim()) || [],
          link: record.fields.link || '',
          github: record.fields.github || '',
        };
      }
    } catch (error) {
      console.error('Error saving portfolio item:', error);
      return null;
    }
  }
  
  static async delete(id: string): Promise<boolean> {
    try {
      await airtableService.deleteRecord(this.TABLE_NAME, id);
      return true;
    } catch (error) {
      console.error('Error deleting portfolio item:', error);
      return false;
    }
  }
}

export class CareerService {
  private static readonly TABLE_NAME = 'Career';
  
  static async getAll(): Promise<CareerItem[]> {
    try {
      const records = await airtableService.fetchRecords(this.TABLE_NAME);
      return records.map(record => ({
        id: record.id,
        title: record.fields.title || '',
        company: record.fields.company || '',
        location: record.fields.location || '',
        period: record.fields.period || '',
        description: record.fields.description || '',
        type: record.fields.type || 'work',
      }));
    } catch (error) {
      console.error('Error fetching career items:', error);
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
      
      if (item.id) {
        const record = await airtableService.updateRecord(this.TABLE_NAME, item.id, fields);
        return {
          id: record.id,
          title: record.fields.title,
          company: record.fields.company,
          location: record.fields.location,
          period: record.fields.period,
          description: record.fields.description,
          type: record.fields.type,
        };
      } else {
        const record = await airtableService.createRecord(this.TABLE_NAME, fields);
        return {
          id: record.id,
          title: record.fields.title,
          company: record.fields.company,
          location: record.fields.location,
          period: record.fields.period,
          description: record.fields.description,
          type: record.fields.type,
        };
      }
    } catch (error) {
      console.error('Error saving career item:', error);
      return null;
    }
  }
  
  static async delete(id: string): Promise<boolean> {
    try {
      await airtableService.deleteRecord(this.TABLE_NAME, id);
      return true;
    } catch (error) {
      console.error('Error deleting career item:', error);
      return false;
    }
  }
}

export class ContactService {
  private static readonly TABLE_NAME = 'Contact';
  
  static async get(): Promise<ContactInfo | null> {
    try {
      const records = await airtableService.fetchRecords(this.TABLE_NAME);
      if (records.length === 0) return null;
      
      const record = records[0];
      return {
        id: record.id,
        email: record.fields.email || '',
        phone: record.fields.phone || '',
        location: record.fields.location || '',
      };
    } catch (error) {
      console.error('Error fetching contact info:', error);
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
      
      if (data.id) {
        const record = await airtableService.updateRecord(this.TABLE_NAME, data.id, fields);
        return {
          id: record.id,
          email: record.fields.email,
          phone: record.fields.phone,
          location: record.fields.location,
        };
      } else {
        const record = await airtableService.createRecord(this.TABLE_NAME, fields);
        return {
          id: record.id,
          email: record.fields.email,
          phone: record.fields.phone,
          location: record.fields.location,
        };
      }
    } catch (error) {
      console.error('Error saving contact info:', error);
      return null;
    }
  }
}

export class SkillService {
  private static readonly TABLE_NAME = 'Skills';
  
  static async getAll(): Promise<SkillItem[]> {
    try {
      const records = await airtableService.fetchRecords(this.TABLE_NAME);
      return records.map(record => ({
        id: record.id,
        name: record.fields.name || '',
        category: record.fields.category || 'other',
        logoSvg: record.fields.logoSvg || '',
      }));
    } catch (error) {
      console.error('Error fetching skills:', error);
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
      
      if (item.id) {
        const record = await airtableService.updateRecord(this.TABLE_NAME, item.id, fields);
        return {
          id: record.id,
          name: record.fields.name,
          category: record.fields.category,
          logoSvg: record.fields.logoSvg,
        };
      } else {
        const record = await airtableService.createRecord(this.TABLE_NAME, fields);
        return {
          id: record.id,
          name: record.fields.name,
          category: record.fields.category,
          logoSvg: record.fields.logoSvg,
        };
      }
    } catch (error) {
      console.error('Error saving skill item:', error);
      return null;
    }
  }
  
  static async delete(id: string): Promise<boolean> {
    try {
      await airtableService.deleteRecord(this.TABLE_NAME, id);
      return true;
    } catch (error) {
      console.error('Error deleting skill item:', error);
      return false;
    }
  }
}
