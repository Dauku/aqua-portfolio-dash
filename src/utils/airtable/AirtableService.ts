
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
    // Initialize with values from localStorage if available
    this.apiKey = localStorage.getItem('airtable_api_key') || '';
    this.baseId = localStorage.getItem('airtable_base_id') || 'appXXXXXXXXXXXXXX';
    
    console.log('AirtableService initialized with baseId:', this.baseId ? 'Set' : 'Not set');
  }
  
  setApiKey(key: string) {
    this.apiKey = key;
    localStorage.setItem('airtable_api_key', key);
    console.log('API key has been set');
  }
  
  setBaseId(id: string) {
    this.baseId = id;
    localStorage.setItem('airtable_base_id', id);
    console.log('Base ID has been set:', id);
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
    
    if (!this.baseId || this.baseId === 'appXXXXXXXXXXXXXX') {
      throw new Error('Valid Airtable Base ID not set');
    }
    
    console.log(`Fetching records from ${tableName} using baseId: ${this.baseId}`);
    
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
export type { AirtableRecord };
