
import { airtableService } from './AirtableService';
import { ContactInfo } from './types';

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
