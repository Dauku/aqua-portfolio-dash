
import { airtableService } from './AirtableService';
import { PortfolioItem } from './types';

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
