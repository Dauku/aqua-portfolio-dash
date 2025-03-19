
import { useState } from 'react';
import { Edit, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { PortfolioItem } from '@/utils/airtable';
import ImageUploader from '@/components/ImageUploader';

interface PortfolioItemFormProps {
  item: PortfolioItem;
  isEditing: boolean;
  onEdit: () => void;
  onChange: (field: string, value: any) => void;
  onDelete: () => void;
  onSave: () => void;
}

const PortfolioItemForm = ({ 
  item, 
  isEditing, 
  onEdit, 
  onChange, 
  onDelete,
  onSave
}: PortfolioItemFormProps) => {
  const [localItem, setLocalItem] = useState<PortfolioItem>(item);
  
  const handleChange = (field: string, value: any) => {
    const updatedItem = { ...localItem, [field]: value };
    setLocalItem(updatedItem);
    onChange(field, value);
  };
  
  const handleTagsChange = (value: string) => {
    const tags = value.split(',').map(tag => tag.trim()).filter(Boolean);
    handleChange('tags', tags);
  };

  const handleImageUploaded = (imageUrl: string) => {
    handleChange('image', imageUrl);
  };
  
  if (!isEditing) {
    return (
      <div className="border rounded-md p-4 mb-4 bg-card hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-bold text-lg">{item.title}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{item.description}</p>
          </div>
          <div className="flex space-x-2">
            <button 
              onClick={onEdit}
              className="p-1 rounded-full hover:bg-muted"
            >
              <Edit className="h-4 w-4" />
            </button>
            <button 
              onClick={onDelete}
              className="p-1 rounded-full hover:bg-destructive/10 text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
        
        <div className="flex items-center mt-2 flex-wrap gap-1">
          {item.tags.map((tag, idx) => (
            <span 
              key={idx} 
              className="px-2 py-1 bg-muted text-xs rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    );
  }
  
  return (
    <div className="border rounded-md p-4 mb-4 bg-card">
      <div className="space-y-4">
        <div>
          <label htmlFor={`title-${item.id || 'new'}`} className="block text-sm font-medium mb-1">
            Title
          </label>
          <Input
            id={`title-${item.id || 'new'}`}
            value={localItem.title}
            onChange={(e) => handleChange('title', e.target.value)}
            placeholder="Project title"
          />
        </div>
        
        <div>
          <label htmlFor={`description-${item.id || 'new'}`} className="block text-sm font-medium mb-1">
            Description
          </label>
          <Textarea
            id={`description-${item.id || 'new'}`}
            value={localItem.description}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="Project description"
            rows={3}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">
            Project Image
          </label>
          <ImageUploader 
            currentImageUrl={localItem.image}
            onImageUploaded={handleImageUploaded}
          />
        </div>
        
        <div>
          <label htmlFor={`tags-${item.id || 'new'}`} className="block text-sm font-medium mb-1">
            Tags (comma separated)
          </label>
          <Input
            id={`tags-${item.id || 'new'}`}
            value={localItem.tags.join(', ')}
            onChange={(e) => handleTagsChange(e.target.value)}
            placeholder="React, TypeScript, UI/UX"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor={`link-${item.id || 'new'}`} className="block text-sm font-medium mb-1">
              Project URL (optional)
            </label>
            <Input
              id={`link-${item.id || 'new'}`}
              value={localItem.link || ''}
              onChange={(e) => handleChange('link', e.target.value)}
              placeholder="https://example.com"
            />
          </div>
          
          <div>
            <label htmlFor={`github-${item.id || 'new'}`} className="block text-sm font-medium mb-1">
              GitHub URL (optional)
            </label>
            <Input
              id={`github-${item.id || 'new'}`}
              value={localItem.github || ''}
              onChange={(e) => handleChange('github', e.target.value)}
              placeholder="https://github.com/username/repo"
            />
          </div>
        </div>
        
        <div className="flex justify-end space-x-2 pt-2">
          <Button 
            variant="outline" 
            onClick={onEdit}
          >
            Cancel
          </Button>
          <Button 
            onClick={onSave}
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PortfolioItemForm;
