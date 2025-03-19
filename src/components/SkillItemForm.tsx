
import { useState } from 'react';
import { Edit, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SkillItem } from '@/utils/airtable';

interface SkillItemFormProps {
  item: SkillItem;
  isEditing: boolean;
  onEdit: () => void;
  onChange: (field: string, value: any) => void;
  onDelete: () => void;
  onSave: () => void;
}

const SkillItemForm = ({ 
  item, 
  isEditing, 
  onEdit, 
  onChange, 
  onDelete,
  onSave
}: SkillItemFormProps) => {
  const [localItem, setLocalItem] = useState<SkillItem>(item);
  
  const handleChange = (field: string, value: any) => {
    const updatedItem = { ...localItem, [field]: value };
    setLocalItem(updatedItem);
    onChange(field, value);
  };
  
  if (!isEditing) {
    return (
      <div className="border rounded-md p-4 mb-4 bg-card hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-bold text-lg">{item.name}</h3>
            <p className="text-sm text-muted-foreground">
              {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
            </p>
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
      </div>
    );
  }
  
  return (
    <div className="border rounded-md p-4 mb-4 bg-card">
      <div className="space-y-4">
        <div>
          <label htmlFor={`name-${item.id || 'new'}`} className="block text-sm font-medium mb-1">
            Skill Name
          </label>
          <Input
            id={`name-${item.id || 'new'}`}
            value={localItem.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="JavaScript"
          />
        </div>
        
        <div>
          <label htmlFor={`category-${item.id || 'new'}`} className="block text-sm font-medium mb-1">
            Category
          </label>
          <Select 
            value={localItem.category} 
            onValueChange={(value: any) => handleChange('category', value)}
          >
            <SelectTrigger id={`category-${item.id || 'new'}`}>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="web">Web Development</SelectItem>
              <SelectItem value="api">API Development</SelectItem>
              <SelectItem value="software">Software Engineering</SelectItem>
              <SelectItem value="network">Networking</SelectItem>
              <SelectItem value="data">Data Science</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <label htmlFor={`logoSvg-${item.id || 'new'}`} className="block text-sm font-medium mb-1">
            Logo SVG (optional)
          </label>
          <Textarea
            id={`logoSvg-${item.id || 'new'}`}
            value={localItem.logoSvg || ''}
            onChange={(e) => handleChange('logoSvg', e.target.value)}
            placeholder="<svg>...</svg>"
            rows={3}
          />
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

export default SkillItemForm;
