
import { airtableService } from './AirtableService';
import { SkillItem } from './types';

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
