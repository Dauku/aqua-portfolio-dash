
import { airtableService } from './AirtableService';
import { HeroData } from './types';

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
