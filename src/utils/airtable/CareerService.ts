
import { airtableService } from './AirtableService';
import { CareerItem } from './types';

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
